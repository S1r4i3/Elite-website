import { Pool } from "pg";
import type { Inquiry, NewInquiry, Customer, DocumentRecord, Lead, LeadStatus, ListLeadsOptions, NewCustomer, NewDocument, NewLead, NewPortalDocument, OtpPurpose, OtpRecord, PortalDocKind, PortalDocument, Repository } from "./types";
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
  clientId: r.client_id ?? null,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  dob: r.dob ? new Date(r.dob).toISOString().slice(0, 10) : null,
  state: r.state,
  country: r.country,
  address: r.address,
  passwordHash: r.password_hash,
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

const toPortalDoc = (r: any): PortalDocument => ({
  id: r.id,
  customerId: r.customer_id,
  kind: r.kind,
  originalName: r.original_name,
  mimeType: r.mime_type,
  size: Number(r.size_bytes),
  category: r.category,
  taxYear: r.tax_year,
  storageKey: r.storage_key,
  note: r.note,
  status: r.status,
  clientComment: r.client_comment,
  createdAt: new Date(r.created_at).toISOString(),
  updatedAt: new Date(r.updated_at).toISOString(),
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

  async assignClientId(id: string) {
    const client = await pool().connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(724201)"); // serialize ID allocation
      const cur = await client.query(`SELECT client_id, created_at FROM customers WHERE id = $1`, [id]);
      if (!cur.rows[0]) {
        await client.query("ROLLBACK");
        return null;
      }
      if (cur.rows[0].client_id) {
        await client.query("COMMIT");
        return cur.rows[0].client_id as string;
      }
      const prefix = `EBT-${new Date(cur.rows[0].created_at).getFullYear()}-`;
      const max = await client.query(
        `SELECT coalesce(max(substring(client_id from ${prefix.length + 1})::int), 0) AS n FROM customers WHERE client_id LIKE $1`,
        [`${prefix}%`],
      );
      const clientId = `${prefix}${String(Number(max.rows[0].n) + 1).padStart(4, "0")}`;
      await client.query(`UPDATE customers SET client_id = $2 WHERE id = $1`, [id, clientId]);
      await client.query("COMMIT");
      return clientId;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async createInquiry(i: NewInquiry) {
    const { rows } = await pool().query(
      `INSERT INTO inquiries (name, phone, email, message, page) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [i.name, i.phone, i.email, i.message, i.page],
    );
    const r = rows[0];
    return { id: r.id, name: r.name, phone: r.phone, email: r.email ?? null, message: r.message, page: r.page, createdAt: new Date(r.created_at).toISOString() };
  }

  async listInquiries(limit = 200) {
    const { rows } = await pool().query(`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ${Number(limit)}`);
    return rows.map((r) => ({ id: r.id, name: r.name, phone: r.phone, email: r.email ?? null, message: r.message, page: r.page, createdAt: new Date(r.created_at).toISOString() }));
  }

  async createCustomer(c: NewCustomer) {
    try {
      const { rows } = await pool().query(
        `INSERT INTO customers (first_name, last_name, email, phone, dob, state, country, address, password_hash, email_verified_at, last_login_at)
         VALUES ($1,$2,lower($3),$4,$5,$6,$7,$8,$9,now(),now()) RETURNING *`,
        [c.firstName, c.lastName, c.email, c.phone, c.dob ?? null, c.state ?? null, c.country ?? null, c.address ?? null, c.passwordHash ?? null],
      );
      const created = toCustomer(rows[0]);
      created.clientId = await this.assignClientId(created.id);
      return created;
    } catch (e) {
      if ((e as { code?: string }).code === "23505") throw new Error("EMAIL_EXISTS");
      throw e;
    }
  }

  async touchCustomerLogin(id: string) {
    await pool().query(`UPDATE customers SET last_login_at = now() WHERE id = $1`, [id]);
  }

  async updateCustomerProfile(id: string, p: Partial<Pick<Customer, "firstName" | "lastName" | "phone" | "dob" | "state" | "country" | "address">>) {
    const { rows } = await pool().query(
      `UPDATE customers SET first_name = coalesce($2, first_name), last_name = coalesce($3, last_name), phone = coalesce($4, phone),
         dob = coalesce($5::date, dob), state = coalesce($6, state), country = coalesce($7, country), address = coalesce($8, address)
       WHERE id = $1 RETURNING *`,
      [id, p.firstName ?? null, p.lastName ?? null, p.phone ?? null, p.dob ?? null, p.state ?? null, p.country ?? null, p.address ?? null],
    );
    return rows[0] ? toCustomer(rows[0]) : null;
  }

  async setCustomerPassword(id: string, passwordHash: string) {
    await pool().query(`UPDATE customers SET password_hash = $2 WHERE id = $1`, [id, passwordHash]);
  }

  async listCustomers(search?: string) {
    const params: unknown[] = [];
    let where = "";
    if (search) {
      params.push(`%${search}%`);
      where = `WHERE (first_name || ' ' || last_name || ' ' || email || ' ' || coalesce(phone,'')) ILIKE $1`;
    }
    const { rows } = await pool().query(`SELECT * FROM customers ${where} ORDER BY created_at DESC LIMIT 500`, params);
    return rows.map(toCustomer);
  }

  async createPortalDocument(d: NewPortalDocument) {
    const { rows } = await pool().query(
      `INSERT INTO portal_documents (id, customer_id, kind, original_name, mime_type, size_bytes, category, tax_year, storage_key, note, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [d.id, d.customerId, d.kind, d.originalName, d.mimeType, d.size, d.category, d.taxYear, d.storageKey, d.note, d.status ?? null],
    );
    return toPortalDoc(rows[0]);
  }

  async listPortalDocuments(customerId: string, kind?: PortalDocKind) {
    const { rows } = kind
      ? await pool().query(`SELECT * FROM portal_documents WHERE customer_id = $1 AND kind = $2 ORDER BY created_at DESC`, [customerId, kind])
      : await pool().query(`SELECT * FROM portal_documents WHERE customer_id = $1 ORDER BY created_at DESC`, [customerId]);
    return rows.map(toPortalDoc);
  }

  async getPortalDocument(id: string) {
    const { rows } = await pool().query(`SELECT * FROM portal_documents WHERE id = $1`, [id]);
    return rows[0] ? toPortalDoc(rows[0]) : null;
  }

  async updatePortalDocument(id: string, patch: Partial<Pick<PortalDocument, "status" | "clientComment" | "note">>) {
    const { rows } = await pool().query(
      `UPDATE portal_documents SET
         status = CASE WHEN $2::boolean THEN $3 ELSE status END,
         client_comment = CASE WHEN $4::boolean THEN $5 ELSE client_comment END,
         note = CASE WHEN $6::boolean THEN $7 ELSE note END,
         updated_at = now()
       WHERE id = $1 RETURNING *`,
      [id, "status" in patch, patch.status ?? null, "clientComment" in patch, patch.clientComment ?? null, "note" in patch, patch.note ?? null],
    );
    return rows[0] ? toPortalDoc(rows[0]) : null;
  }

  async deletePortalDocument(id: string) {
    await pool().query(`DELETE FROM portal_documents WHERE id = $1`, [id]);
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
