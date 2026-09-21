import { Pool } from "pg";
import type { Customer, DocumentRecord, Lead, LeadStatus, ListLeadsOptions, NewCustomer, NewDocument, NewLead, OtpPurpose, OtpRecord, Repository } from "./types";
import { leadStatuses } from "./types";

const globalForPg = globalThis as unknown as { __elitePgPool?: Pool };

function pool() {
  if (!globalForPg.__elitePgPool) {
    globalForPg.__elitePgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }
  return globalForPg.__elitePgPool;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const toLead = (r: any): Lead => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  service: r.service,
  customerType: r.customer_type,
  taxYear: r.tax_year,
  message: r.message,
  source: r.source,
  estimate: r.estimate,
  status: r.status,
  assignedTo: r.assigned_to,
  createdAt: new Date(r.created_at).toISOString(),
  updatedAt: new Date(r.updated_at).toISOString(),
});

const toDoc = (r: any): DocumentRecord => ({
  id: r.id,
  leadId: r.lead_id,
  originalName: r.original_name,
  mimeType: r.mime_type,
  size: Number(r.size_bytes),
  category: r.category,
  storageKey: r.storage_key,
  createdAt: new Date(r.created_at).toISOString(),
});

const toCustomer = (r: any): Customer => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  emailVerifiedAt: r.email_verified_at ? new Date(r.email_verified_at).toISOString() : null,
  lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : null,
  createdAt: new Date(r.created_at).toISOString(),
});

const toOtp = (r: any): OtpRecord => ({
  email: r.email,
  purpose: r.purpose,
  codeHash: r.code_hash,
  attempts: r.attempts,
  payload: r.payload,
  expiresAt: new Date(r.expires_at).toISOString(),
  createdAt: new Date(r.created_at).toISOString(),
});

export class PostgresRepository implements Repository {
  readonly driver = "postgres" as const;

  async createLead(l: NewLead, documentIds: string[] = []) {
    const client = await pool().connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `INSERT INTO leads (first_name, last_name, email, phone, service, customer_type, tax_year, message, source, estimate)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [l.firstName, l.lastName, l.email, l.phone, l.service, l.customerType, l.taxYear, l.message, l.source, l.estimate],
      );
      if (documentIds.length) {
        await client.query(`UPDATE documents SET lead_id = $1 WHERE id = ANY($2::uuid[]) AND lead_id IS NULL`, [rows[0].id, documentIds]);
      }
      await client.query("COMMIT");
      return toLead(rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async listLeads({ status, search, limit = 50, offset = 0 }: ListLeadsOptions = {}) {
    const where: string[] = [];
    const params: unknown[] = [];
    if (status) {
      params.push(status);
      where.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      where.push(`(first_name || ' ' || last_name || ' ' || email || ' ' || phone) ILIKE $${params.length}`);
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const total = await pool().query(`SELECT count(*)::int AS n FROM leads ${clause}`, params);
    const { rows } = await pool().query(
      `SELECT * FROM leads ${clause} ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      params,
    );
    const leads = rows.map(toLead);
    if (leads.length) {
      const docs = await pool().query(`SELECT * FROM documents WHERE lead_id = ANY($1::uuid[])`, [leads.map((l) => l.id)]);
      for (const lead of leads) lead.documents = docs.rows.filter((d) => d.lead_id === lead.id).map(toDoc);
    }
    return { leads, total: total.rows[0].n as number };
  }

  async getLead(id: string) {
    const { rows } = await pool().query(`SELECT * FROM leads WHERE id = $1`, [id]);
    if (!rows[0]) return null;
    const lead = toLead(rows[0]);
    const docs = await pool().query(`SELECT * FROM documents WHERE lead_id = $1 ORDER BY created_at`, [id]);
    lead.documents = docs.rows.map(toDoc);
    return lead;
  }

  async updateLeadStatus(id: string, status: LeadStatus) {
    const { rows } = await pool().query(`UPDATE leads SET status = $2, updated_at = now() WHERE id = $1 RETURNING *`, [id, status]);
    return rows[0] ? toLead(rows[0]) : null;
  }

  async createDocument(d: NewDocument) {
    const { rows } = await pool().query(
      `INSERT INTO documents (id, lead_id, original_name, mime_type, size_bytes, category, storage_key)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [d.id, d.leadId, d.originalName, d.mimeType, d.size, d.category, d.storageKey],
    );
    return toDoc(rows[0]);
  }

  async getDocument(id: string) {
    const { rows } = await pool().query(`SELECT * FROM documents WHERE id = $1`, [id]);
    return rows[0] ? toDoc(rows[0]) : null;
  }

  async stats() {
    const { rows } = await pool().query(`SELECT status, count(*)::int AS n FROM leads GROUP BY status`);
    const docs = await pool().query(`SELECT count(*)::int AS n FROM documents`);
    const counts = Object.fromEntries(leadStatuses.map((s) => [s, 0])) as Record<LeadStatus, number>;
    let total = 0;
    for (const r of rows) {
      counts[r.status as LeadStatus] = r.n;
      total += r.n;
    }
    return { ...counts, total, documents: docs.rows[0].n as number };
  }

  async findCustomerByEmail(email: string) {
    const { rows } = await pool().query(`SELECT * FROM customers WHERE lower(email) = lower($1)`, [email]);
    return rows[0] ? toCustomer(rows[0]) : null;
  }

  async getCustomer(id: string) {
    const { rows } = await pool().query(`SELECT * FROM customers WHERE id = $1`, [id]);
    return rows[0] ? toCustomer(rows[0]) : null;
  }

  async createCustomer(c: NewCustomer) {
    try {
      const { rows } = await pool().query(
        `INSERT INTO customers (first_name, last_name, email, phone, email_verified_at, last_login_at)
         VALUES ($1,$2,lower($3),$4,now(),now()) RETURNING *`,
        [c.firstName, c.lastName, c.email, c.phone],
      );
      return toCustomer(rows[0]);
    } catch (e) {
      if ((e as { code?: string }).code === "23505") throw new Error("EMAIL_EXISTS");
      throw e;
    }
  }

  async touchCustomerLogin(id: string) {
    await pool().query(`UPDATE customers SET last_login_at = now() WHERE id = $1`, [id]);
  }

  async saveOtp(o: OtpRecord) {
    await pool().query(`DELETE FROM auth_otps WHERE expires_at < now()`);
    await pool().query(
      `INSERT INTO auth_otps (email, purpose, code_hash, attempts, payload, expires_at, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (email, purpose) DO UPDATE SET code_hash = EXCLUDED.code_hash, attempts = EXCLUDED.attempts,
         payload = EXCLUDED.payload, expires_at = EXCLUDED.expires_at, created_at = EXCLUDED.created_at`,
      [o.email, o.purpose, o.codeHash, o.attempts, o.payload, o.expiresAt, o.createdAt],
    );
  }

  async getOtp(email: string, purpose: OtpPurpose) {
    const { rows } = await pool().query(`SELECT * FROM auth_otps WHERE email = $1 AND purpose = $2`, [email, purpose]);
    return rows[0] ? toOtp(rows[0]) : null;
  }

  async incrementOtpAttempts(email: string, purpose: OtpPurpose) {
    await pool().query(`UPDATE auth_otps SET attempts = attempts + 1 WHERE email = $1 AND purpose = $2`, [email, purpose]);
  }

  async deleteOtp(email: string, purpose: OtpPurpose) {
    await pool().query(`DELETE FROM auth_otps WHERE email = $1 AND purpose = $2`, [email, purpose]);
  }
}
