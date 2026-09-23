import type { Customer, Inquiry, Lead, PortalDocument } from "@/lib/db";

/** Stable JSON shapes for the admin API. Never leak password hashes or storage keys. */
export const apiClient = (c: Customer) => ({
  id: c.id,
  clientId: c.clientId,
  firstName: c.firstName,
  lastName: c.lastName,
  name: `${c.firstName} ${c.lastName}`.trim(),
  email: c.email,
  phone: c.phone,
  dob: c.dob,
  state: c.state,
  country: c.country,
  address: c.address,
  emailVerified: Boolean(c.emailVerifiedAt),
  emailVerifiedAt: c.emailVerifiedAt,
  lastLoginAt: c.lastLoginAt,
  createdAt: c.createdAt,
});

export const apiDocument = (d: PortalDocument) => ({
  id: d.id,
  clientId: d.customerId,
  kind: d.kind,
  name: d.originalName,
  mimeType: d.mimeType,
  size: d.size,
  sizeKb: Math.round(d.size / 1024),
  category: d.category,
  taxYear: d.taxYear,
  note: d.note,
  status: d.status,
  clientComment: d.clientComment,
  downloadUrl: `/api/v1/admin/documents/${d.id}/file`,
  createdAt: d.createdAt,
  updatedAt: d.updatedAt,
});

export const apiInquiry = (i: Inquiry) => ({
  id: i.id,
  name: i.name,
  phone: i.phone,
  email: i.email,
  message: i.message,
  page: i.page,
  createdAt: i.createdAt,
});

export const apiLead = (l: Lead) => ({
  id: l.id,
  firstName: l.firstName,
  lastName: l.lastName,
  name: `${l.firstName} ${l.lastName}`.trim(),
  email: l.email,
  phone: l.phone,
  service: l.service,
  customerType: l.customerType,
  taxYear: l.taxYear,
  message: l.message,
  source: l.source,
  status: l.status,
  documents: l.documents?.length ?? 0,
  createdAt: l.createdAt,
  updatedAt: l.updatedAt,
});
