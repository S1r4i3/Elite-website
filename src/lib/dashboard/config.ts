/** Client portal sections (sidebar order). */
export const dashboardSections = [
  { slug: "", label: "Dashboard", icon: "LayoutDashboard", description: "Your filing overview at a glance." },
  { slug: "upload-documents", label: "Upload Documents", icon: "UploadCloud", description: "Send your tax documents securely to your tax professional." },
  { slug: "my-documents", label: "My Documents", icon: "FolderOpen", description: "Everything you've uploaded, organized by type and tax year." },
  { slug: "draft-estimation", label: "Draft Estimation", icon: "Calculator", description: "Review the draft tax estimate prepared for you, then approve it or ask for changes." },
  { slug: "final-documents", label: "Final Documents", icon: "FileCheck2", description: "Your completed returns and final documents, ready to download." },
] as const;

/** Account pages shown under the main sections. */
export const accountSections = [{ slug: "profile", label: "Profile & Password", icon: "UserRound", description: "Keep your details up to date and change your password." }] as const;
export const allDashboardSections = [...dashboardSections, ...accountSections];

export type DashboardSection = (typeof dashboardSections)[number];
