import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Inquiry, NewInquiry, Customer, DocumentRecord, Lead, LeadStatus, ListLeadsOptions, NewCustomer, NewDocument, NewLead, NewPortalDocument, OtpPurpose, OtpRecord, PortalDocKind, PortalDocument, Repository } from "./types";
import { leadStatuses } from "./types";

type DbShape = { leads: Lead[]; documents: DocumentRecord[]; customers?: Customer[]; otps?: OtpRecord[]; portalDocuments?: PortalDocument[]; inquiries?: Inquiry[] };

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

/** Next sequential client ID for the year, e.g. EBT-2026-0007. */
function nextClientId(customers: Customer[], when: Date) {
  const prefix = `EBT-${when.getFullYear()}-`;
  let max = 0;
  for (const c of customers) {
    if (c.clientId?.startsWith(prefix)) max = Math.max(max, parseInt(c.clientId.slice(prefix.length), 10) || 0);
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

const normalizeCustomer = (c?: Customer): Customer | null =>
  c ? Object.assign({ clientId: null, dob: null, state: null, country: null, address: null, passwordHash: null }, c) : null;

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
    return normalizeCustomer(db.customers?.find((c) => c.email === email.toLowerCase()));
  }

  async getCustomer(id: string) {
    const db = await read();
    return normalizeCustomer(db.customers?.find((c) => c.id === id));
  }

  createCustomer(input: NewCustomer) {
    return mutate((db) => {
      db.customers ??= [];
      const email = input.email.toLowerCase();
      if (db.customers.some((c) => c.email === email)) throw new Error("EMAIL_EXISTS");
      const now = new Date().toISOString();
      const customer: Customer = {
        clientId: nextClientId(db.customers, new Date()),
        dob: null,
        state: null,
        country: null,
        address: null,
        passwordHash: null,
        ...input,
        email,
        id: randomUUID(),
        emailVerifiedAt: now,
        lastLoginAt: now,
        createdAt: now,
      };
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

  updateCustomerProfile(id: string, patch: Partial<Pick<Customer, "firstName" | "lastName" | "phone" | "dob" | "state" | "country" | "address">>) {
    return mutate((db) => {
      const c = db.customers?.find((x) => x.id === id);
      if (!c) return null;
      Object.assign(c, patch);
      return normalizeCustomer(c);
    });
  }

  async setCustomerPassword(id: string, passwordHash: string) {
    await mutate((db) => {
      const c = db.customers?.find((x) => x.id === id);
      if (c) c.passwordHash = passwordHash;
    });
  }

  async listCustomers(search?: string) {
    const db = await read();
    let list = (db.customers ?? []).map((c) => normalizeCustomer(c)!);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => `${c.firstName} ${c.lastName} ${c.email} ${c.phone ?? ""}`.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  assignClientId(id: string) {
    return mutate((db) => {
      const c = db.customers?.find((x) => x.id === id);
      if (!c) return null;
      if (!c.clientId) c.clientId = nextClientId(db.customers ?? [], new Date(c.createdAt));
      return c.clientId;
    });
  }

  createInquiry(input: NewInquiry) {
    return mutate((db) => {
      const inq: Inquiry = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
      (db.inquiries ??= []).unshift(inq);
      return inq;
    });
  }

  async listInquiries(limit = 200) {
    const db = await read();
    return (db.inquiries ?? []).slice(0, limit);
  }

  createPortalDocument(input: NewPortalDocument) {
    return mutate((db) => {
      const now = new Date().toISOString();
      const doc: PortalDocument = { status: null, ...input, clientComment: null, createdAt: now, updatedAt: now };
      (db.portalDocuments ??= []).push(doc);
      return doc;
    });
  }

  async listPortalDocuments(customerId: string, kind?: PortalDocKind) {
    const db = await read();
    return (db.portalDocuments ?? [])
      .filter((d) => d.customerId === customerId && (!kind || d.kind === kind))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getPortalDocument(id: string) {
    const db = await read();
    return db.portalDocuments?.find((d) => d.id === id) ?? null;
  }

  updatePortalDocument(id: string, patch: Partial<Pick<PortalDocument, "status" | "clientComment" | "note">>) {
    return mutate((db) => {
      const d = db.portalDocuments?.find((x) => x.id === id);
      if (!d) return null;
      Object.assign(d, patch, { updatedAt: new Date().toISOString() });
      return d;
    });
  }

  async deletePortalDocument(id: string) {
    await mutate((db) => {
      db.portalDocuments = (db.portalDocuments ?? []).filter((d) => d.id !== id);
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
