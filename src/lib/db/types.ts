export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "closed"];

export type DocumentRecord = {
  id: string;
  leadId: string | null;
  originalName: string;
  mimeType: string;
  size: number;
  category: string | null;
  storageKey: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  customerType: string;
  taxYear: string;
  message: string | null;
  source: string | null;
  estimate: Record<string, unknown> | null;
  status: LeadStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  documents?: DocumentRecord[];
};

export type NewLead = Omit<Lead, "id" | "status" | "assignedTo" | "createdAt" | "updatedAt" | "documents">;
export type NewDocument = Omit<DocumentRecord, "createdAt">;

export type ListLeadsOptions = { status?: LeadStatus; search?: string; limit?: number; offset?: number };

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};
export type NewCustomer = Pick<Customer, "firstName" | "lastName" | "email" | "phone">;

export type OtpPurpose = "login" | "register";
export type OtpRecord = {
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  attempts: number;
  /** Pending registration details, kept until the code is verified. */
  payload: Record<string, unknown> | null;
  expiresAt: string;
  createdAt: string;
};

/** Persistence contract. Swap implementations without touching routes or UI. */
export interface Repository {
  readonly driver: "postgres" | "file";
  createLead(lead: NewLead, documentIds?: string[]): Promise<Lead>;
  listLeads(opts?: ListLeadsOptions): Promise<{ leads: Lead[]; total: number }>;
  getLead(id: string): Promise<Lead | null>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null>;
  createDocument(doc: NewDocument): Promise<DocumentRecord>;
  getDocument(id: string): Promise<DocumentRecord | null>;
  stats(): Promise<Record<LeadStatus, number> & { total: number; documents: number }>;

  // Customer accounts (email OTP sign-in)
  findCustomerByEmail(email: string): Promise<Customer | null>;
  getCustomer(id: string): Promise<Customer | null>;
  createCustomer(c: NewCustomer): Promise<Customer>;
  touchCustomerLogin(id: string): Promise<void>;
  saveOtp(otp: OtpRecord): Promise<void>;
  getOtp(email: string, purpose: OtpPurpose): Promise<OtpRecord | null>;
  incrementOtpAttempts(email: string, purpose: OtpPurpose): Promise<void>;
  deleteOtp(email: string, purpose: OtpPurpose): Promise<void>;
}
