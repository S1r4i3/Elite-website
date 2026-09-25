import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  Customer, DocumentRecord, Inquiry, Lead, LeadStatus, ListLeadsOptions, NewCustomer, NewDocument, NewInquiry,
  NewLead, NewPortalDocument, OtpPurpose, OtpRecord, PortalDocKind, PortalDocument, Repository,
} from "./types";
import { leadStatuses } from "./types";

/* ───────── row → app shape ───────── */

/* eslint-disable @typescript-eslint/no-explicit-any */
const toCustomer = (r: any): Customer => ({
  id: r.id,
  clientId: r.client_id ?? null,
  firstName: r.first_name ?? "",
  lastName: r.last_name ?? "",
  email: r.email,
  phone: r.phone ?? null,
  dob: r.dob ?? null,
  state: r.state ?? null,
  country: r.country ?? null,
  address: r.address ?? null,
  // Passwords live in Supabase Auth, never in this table.
  passwordHash: "supabase",
  emailVerifiedAt: r.email_verified_at ?? r.created_at ?? null,
  lastLoginAt: r.last_login_at ?? null,
  createdAt: r.created_at,
  workflowStage: r.stage ?? null,
  docStatus: r.doc_status ?? null,
});

const toPortalDoc = (r: any): PortalDocument => ({
  id: r.id,
  customerId: r.customer_id,
  kind: r.kind,
  originalName: r.original_name,
  mimeType: r.mime_type,
  size: Number(r.size ?? 0),
  category: r.category ?? null,
  taxYear: r.tax_year ?? null,
  storageKey: r.storage_key,
  note: r.note ?? null,
  status: r.status ?? null,
  clientComment: r.client_comment ?? null,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toLead = (r: any): Lead => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  service: r.service,
  customerType: r.customer_type ?? "",
  taxYear: r.tax_year ?? "",
  message: r.message ?? null,
  source: r.source ?? null,
  estimate: r.estimate ?? null,
  status: r.status,
  assignedTo: r.assigned_to ?? null,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toInquiry = (r: any): Inquiry => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  email: r.email ?? null,
  message: r.message ?? null,
  page: r.page ?? null,
  createdAt: r.created_at,
});

const toDocument = (r: any): DocumentRecord => ({
  id: r.id,
  leadId: r.lead_id ?? null,
  originalName: r.original_name,
  mimeType: r.mime_type,
  size: Number(r.size ?? 0),
  category: r.category ?? null,
  storageKey: r.storage_key,
  createdAt: r.created_at,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

const fail = (where: string, error: { message: string } | null) => {
  if (error) throw new Error(`[supabase] ${where}: ${error.message}`);
};

/**
 * Supabase implementation of the data contract.
 *
 * Client accounts live in Supabase Auth; `public.profiles` holds their details.
 * Everything here runs with the service-role key, so row-level security is
 * bypassed on purpose — these calls are all server-side and already checked
 * against the signed-in user (or the admin API token) before they get here.
 */
export class SupabaseRepository implements Repository {
  readonly driver = "postgres" as const;

  private db() {
    return supabaseAdmin();
  }

  /* ───────── customers ───────── */

  async findCustomerByEmail(email: string) {
    const { data, error } = await this.db().from("profiles").select("*").ilike("email", email).maybeSingle();
    fail("findCustomerByEmail", error);
    return data ? toCustomer(data) : null;
  }

  async getCustomer(id: string) {
    const { data, error } = await this.db().from("profiles").select("*").eq("id", id).maybeSingle();
    fail("getCustomer", error);
    return data ? toCustomer(data) : null;
  }

  async createCustomer(c: NewCustomer) {
    // Registration normally goes through Supabase Auth; this covers admin-created accounts.
    const { data, error } = await this.db().auth.admin.createUser({
      email: c.email,
      email_confirm: true,
      user_metadata: {
        first_name: c.firstName,
        last_name: c.lastName,
        phone: c.phone ?? "",
        dob: c.dob ?? "",
        state: c.state ?? "",
        country: c.country ?? "",
        address: c.address ?? "",
      },
    });
    if (error) {
      if (/already/i.test(error.message)) throw new Error("EMAIL_EXISTS");
      throw new Error(`[supabase] createCustomer: ${error.message}`);
    }
    const created = await this.getCustomer(data.user.id);
    if (!created) throw new Error("[supabase] createCustomer: profile was not created");
    return created;
  }

  async touchCustomerLogin(id: string) {
    await this.db().from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", id);
  }

  async setCustomerPassword(id: string, password: string) {
    // `password` is the plain password here — Supabase Auth hashes it.
    const { error } = await this.db().auth.admin.updateUserById(id, { password });
    fail("setCustomerPassword", error);
  }

  async updateCustomerProfile(id: string, patch: Partial<Pick<Customer, "firstName" | "lastName" | "phone" | "dob" | "state" | "country" | "address">>) {
    const row: Record<string, unknown> = {};
    if (patch.firstName !== undefined) row.first_name = patch.firstName;
    if (patch.lastName !== undefined) row.last_name = patch.lastName;
    if (patch.phone !== undefined) row.phone = patch.phone;
    if (patch.dob !== undefined) row.dob = patch.dob || null;
    if (patch.state !== undefined) row.state = patch.state;
    if (patch.country !== undefined) row.country = patch.country;
    if (patch.address !== undefined) row.address = patch.address;
    if (Object.keys(row).length === 0) return this.getCustomer(id);
    const { data, error } = await this.db().from("profiles").update(row).eq("id", id).select("*").maybeSingle();
    fail("updateCustomerProfile", error);
    return data ? toCustomer(data) : null;
  }

  async listCustomers(search?: string) {
    let q = this.db().from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
    if (search) {
      const s = `%${search}%`;
      q = q.or(`first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s},phone.ilike.${s},client_id.ilike.${s}`);
    }
    const { data, error } = await q;
    fail("listCustomers", error);
    return (data ?? []).map(toCustomer);
  }

  async assignClientId(id: string) {
    const existing = await this.getCustomer(id);
    if (existing?.clientId) return existing.clientId;
    const { data: generated, error: genError } = await this.db().rpc("next_client_id");
    fail("assignClientId", genError);
    const { data, error } = await this.db().from("profiles").update({ client_id: generated }).eq("id", id).select("client_id").maybeSingle();
    fail("assignClientId", error);
    return (data?.client_id as string) ?? null;
  }

  /* ───────── client portal documents ───────── */

  async createPortalDocument(doc: NewPortalDocument) {
    const { data, error } = await this.db()
      .from("portal_documents")
      .insert({
        id: doc.id,
        customer_id: doc.customerId,
        kind: doc.kind,
        original_name: doc.originalName,
        mime_type: doc.mimeType,
        size: doc.size,
        category: doc.category,
        tax_year: doc.taxYear,
        storage_key: doc.storageKey,
        note: doc.note,
        status: doc.status ?? null,
      })
      .select("*")
      .single();
    fail("createPortalDocument", error);
    return toPortalDoc(data);
  }

  async listPortalDocuments(customerId: string, kind?: PortalDocKind) {
    let q = this.db().from("portal_documents").select("*").eq("customer_id", customerId).order("created_at", { ascending: false });
    if (kind) q = q.eq("kind", kind);
    const { data, error } = await q;
    fail("listPortalDocuments", error);
    return (data ?? []).map(toPortalDoc);
  }

  async listAllPortalDocuments(opts: { kind?: PortalDocKind; customerId?: string; limit?: number; offset?: number } = {}) {
    const limit = opts.limit ?? 200;
    const offset = opts.offset ?? 0;
    let q = this.db().from("portal_documents").select("*").order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (opts.kind) q = q.eq("kind", opts.kind);
    if (opts.customerId) q = q.eq("customer_id", opts.customerId);
    const { data, error } = await q;
    fail("listAllPortalDocuments", error);
    return (data ?? []).map(toPortalDoc);
  }

  async countPortalDocuments() {
    const counts: Record<PortalDocKind, number> = { upload: 0, draft: 0, final: 0 };
    await Promise.all(
      (Object.keys(counts) as PortalDocKind[]).map(async (kind) => {
        const { count } = await this.db().from("portal_documents").select("id", { count: "exact", head: true }).eq("kind", kind);
        counts[kind] = count ?? 0;
      }),
    );
    return counts;
  }

  async getPortalDocument(id: string) {
    const { data, error } = await this.db().from("portal_documents").select("*").eq("id", id).maybeSingle();
    fail("getPortalDocument", error);
    return data ? toPortalDoc(data) : null;
  }

  async updatePortalDocument(id: string, patch: Partial<Pick<PortalDocument, "status" | "clientComment" | "note">>) {
    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.clientComment !== undefined) row.client_comment = patch.clientComment;
    if (patch.note !== undefined) row.note = patch.note;
    if (Object.keys(row).length === 0) return this.getPortalDocument(id);
    const { data, error } = await this.db().from("portal_documents").update(row).eq("id", id).select("*").maybeSingle();
    fail("updatePortalDocument", error);
    return data ? toPortalDoc(data) : null;
  }

  async deletePortalDocument(id: string) {
    const { error } = await this.db().from("portal_documents").delete().eq("id", id);
    fail("deletePortalDocument", error);
  }

  /* ───────── website forms ───────── */

  async createInquiry(i: NewInquiry) {
    const { data, error } = await this.db()
      .from("inquiries")
      .insert({ name: i.name, phone: i.phone, email: i.email, message: i.message, page: i.page })
      .select("*")
      .single();
    fail("createInquiry", error);
    return toInquiry(data);
  }

  async listInquiries(limit = 200) {
    const { data, error } = await this.db().from("inquiries").select("*").order("created_at", { ascending: false }).limit(limit);
    fail("listInquiries", error);
    return (data ?? []).map(toInquiry);
  }

  async createLead(lead: NewLead, documentIds: string[] = []) {
    const { data, error } = await this.db()
      .from("leads")
      .insert({
        first_name: lead.firstName,
        last_name: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        customer_type: lead.customerType,
        tax_year: lead.taxYear,
        message: lead.message,
        source: lead.source,
        estimate: lead.estimate,
      })
      .select("*")
      .single();
    fail("createLead", error);
    if (documentIds.length) {
      await this.db().from("lead_documents").update({ lead_id: data.id }).in("id", documentIds);
    }
    return toLead(data);
  }

  async listLeads(opts: ListLeadsOptions = {}) {
    const limit = opts.limit ?? 50;
    const offset = opts.offset ?? 0;
    let q = this.db().from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (opts.status) q = q.eq("status", opts.status);
    if (opts.search) {
      const s = `%${opts.search}%`;
      q = q.or(`first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s},phone.ilike.${s},service.ilike.${s}`);
    }
    const { data, error, count } = await q;
    fail("listLeads", error);
    return { leads: (data ?? []).map(toLead), total: count ?? 0 };
  }

  async getLead(id: string) {
    const { data, error } = await this.db().from("leads").select("*").eq("id", id).maybeSingle();
    fail("getLead", error);
    if (!data) return null;
    const { data: docs } = await this.db().from("lead_documents").select("*").eq("lead_id", id);
    return { ...toLead(data), documents: (docs ?? []).map(toDocument) };
  }

  async updateLeadStatus(id: string, status: LeadStatus) {
    if (!leadStatuses.includes(status)) return null;
    const { data, error } = await this.db().from("leads").update({ status }).eq("id", id).select("*").maybeSingle();
    fail("updateLeadStatus", error);
    return data ? toLead(data) : null;
  }

  async createDocument(doc: NewDocument) {
    const { data, error } = await this.db()
      .from("lead_documents")
      .insert({
        id: doc.id,
        lead_id: doc.leadId,
        original_name: doc.originalName,
        mime_type: doc.mimeType,
        size: doc.size,
        category: doc.category,
        storage_key: doc.storageKey,
      })
      .select("*")
      .single();
    fail("createDocument", error);
    return toDocument(data);
  }

  async getDocument(id: string) {
    const { data, error } = await this.db().from("lead_documents").select("*").eq("id", id).maybeSingle();
    fail("getDocument", error);
    return data ? toDocument(data) : null;
  }

  async stats() {
    const counts = Object.fromEntries(leadStatuses.map((s) => [s, 0])) as Record<LeadStatus, number>;
    let total = 0;
    await Promise.all(
      leadStatuses.map(async (s) => {
        const { count } = await this.db().from("leads").select("id", { count: "exact", head: true }).eq("status", s);
        counts[s] = count ?? 0;
        total += counts[s];
      }),
    );
    const { count: documents } = await this.db().from("lead_documents").select("id", { count: "exact", head: true });
    return { ...counts, total, documents: documents ?? 0 };
  }

  /* ───────── one-time codes ─────────
     Supabase Auth issues and verifies its own codes, so these are no-ops
     kept only to satisfy the shared data contract. */

  async saveOtp(_otp: OtpRecord) {}
  async getOtp(_email: string, _purpose: OtpPurpose) {
    return null;
  }
  async incrementOtpAttempts(_email: string, _purpose: OtpPurpose) {}
  async deleteOtp(_email: string, _purpose: OtpPurpose) {}
}
