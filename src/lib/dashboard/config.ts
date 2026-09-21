/**
 * Customer dashboard — future architecture.
 * Each section maps to a REST resource the backend will expose. UI is scaffolded with empty states
 * so features can be switched on as the APIs (see db/schema.sql) come online.
 */
export const dashboardSections = [
  { slug: "", label: "Dashboard", icon: "LayoutDashboard", api: "/api/me/summary", empty: "Your filing overview will appear here once your account is set up." },
  { slug: "filing-status", label: "Tax Filing Status", icon: "ListChecks", api: "/api/me/filings", empty: "Track each return from intake to IRS acceptance." },
  { slug: "documents", label: "Documents", icon: "FolderOpen", api: "/api/me/documents", empty: "Documents you upload and files we share with you will be listed here." },
  { slug: "messages", label: "Messages", icon: "MessagesSquare", api: "/api/me/messages", empty: "Secure messages with your assigned tax professional." },
  { slug: "payments", label: "Payments", icon: "CreditCard", api: "/api/me/payments", empty: "Invoices and payment history (payment gateway integration)." },
  { slug: "tax-returns", label: "Tax Returns", icon: "FileArchive", api: "/api/me/returns", empty: "Download copies of your completed returns." },
  { slug: "support", label: "Support", icon: "LifeBuoy", api: "/api/me/appointments", empty: "Book an appointment or contact support." },
] as const;

export type DashboardSection = (typeof dashboardSections)[number];
