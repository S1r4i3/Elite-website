import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Customer, DocumentRecord, Lead, LeadStatus, ListLeadsOptions, NewCustomer, NewDocument, NewLead, OtpPurpose, OtpRecord, Repository } from "./types";
import { leadStatuses } from "./types";

type DbShape = { leads: Lead[]; documents: DocumentRecord[]; customers?: Customer[]; otps?: OtpRecord[] };

const DATA_DIR = path.resolve(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

let queue: Promise<unknown> = Promise.resolve();

async function read(): Promise<DbShape> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as DbShape;
  } catch {
    return { leads: [], documents: [] };
  }
}

async function write(db: DbShape) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, DB_FILE);
}

/** Serialize mutations so concurrent requests don't clobber each other. */
function mutate<T>(fn: (db: DbShape) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await read();
    const result = await fn(db);
    await write(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

/** Development / single-instance store. Use PostgreSQL in production. */
export class FileRepository implements Repository {
  readonly driver = "file" as const;

  createLead(input: NewLead, documentIds: string[] = []) {
    return mutate((db) => {
      const now = new Date().toISOString();
      const lead: Lead = { ...input, id: randomUUID(), status: "new", assignedTo: null, createdAt: now, updatedAt: now };
      db.leads.unshift(lead);
      for (const doc of db.documents) if (documentIds.includes(doc.id) && !doc.leadId) doc.leadId = lead.id;
      return lead;
    });
  }

  async listLeads({ status, search, limit = 50, offset = 0 }: ListLeadsOptions = {}) {
    const db = await read();
    let leads = db.leads;
    if (status) leads = leads.filter((l) => l.status === status);
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter((l) => `${l.firstName} ${l.lastName} ${l.email} ${l.phone}`.toLowerCase().includes(q));
    }
    const page = leads.slice(offset, offset + limit).map((l) => ({
      ...l,
      documents: db.documents.filter((d) => d.leadId === l.id),
    }));
    return { leads: page, total: leads.length };
  }

  async getLead(id: string) {
    const db = await read();
    const lead = db.leads.find((l) => l.id === id);
    return lead ? { ...lead, documents: db.documents.filter((d) => d.leadId === id) } : null;
  }

  updateLeadStatus(id: string, status: LeadStatus) {
    return mutate((db) => {
      const lead = db.leads.find((l) => l.id === id);
      if (!lead) return null;
      lead.status = status;
      lead.updatedAt = new Date().toISOString();
      return lead;
    });
  }

  createDocument(input: NewDocument) {
    return mutate((db) => {
      const doc: DocumentRecord = { ...input, createdAt: new Date().toISOString() };
      db.documents.push(doc);
      return doc;
    });
  }

  async getDocument(id: string) {
    const db = await read();
    return db.documents.find((d) => d.id === id) ?? null;
  }

  async stats() {
    const db = await read();
    const counts = Object.fromEntries(leadStatuses.map((s) => [s, 0])) as Record<LeadStatus, number>;
    for (const l of db.leads) counts[l.status]++;
    return { ...counts, total: db.leads.length, documents: db.documents.length };
  }

  async findCustomerByEmail(email: string) {
    const db = await read();
    return db.customers?.find((c) => c.email === email.toLowerCase()) ?? null;
  }

  async getCustomer(id: string) {
    const db = await read();
    return db.customers?.find((c) => c.id === id) ?? null;
  }

  createCustomer(input: NewCustomer) {
    return mutate((db) => {
      db.customers ??= [];
      const email = input.email.toLowerCase();
      if (db.customers.some((c) => c.email === email)) throw new Error("EMAIL_EXISTS");
      const now = new Date().toISOString();
      const customer: Customer = { ...input, email, id: randomUUID(), emailVerifiedAt: now, lastLoginAt: now, createdAt: now };
      db.customers.push(customer);
      return customer;
    });
  }

  async touchCustomerLogin(id: string) {
    await mutate((db) => {
      const c = db.customers?.find((x) => x.id === id);
      if (c) c.lastLoginAt = new Date().toISOString();
    });
  }

  async saveOtp(otp: OtpRecord) {
    await mutate((db) => {
      const now = Date.now();
      db.otps = (db.otps ?? []).filter((o) => !(o.email === otp.email && o.purpose === otp.purpose) && Date.parse(o.expiresAt) > now);
      db.otps.push(otp);
    });
  }

  async getOtp(email: string, purpose: OtpPurpose) {
    const db = await read();
    return db.otps?.find((o) => o.email === email && o.purpose === purpose) ?? null;
  }

  async incrementOtpAttempts(email: string, purpose: OtpPurpose) {
    await mutate((db) => {
      const o = db.otps?.find((x) => x.email === email && x.purpose === purpose);
      if (o) o.attempts++;
    });
  }

  async deleteOtp(email: string, purpose: OtpPurpose) {
    await mutate((db) => {
      db.otps = (db.otps ?? []).filter((o) => !(o.email === email && o.purpose === purpose));
    });
  }
}
