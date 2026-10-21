/** Shared (client + server) labels and options for the client portal. */
export const documentTypes = [
  { value: "w2", label: "W-2 (wages)" },
  { value: "1099", label: "1099 (interest, dividends, contract work…)" },
  { value: "1098", label: "1098 (mortgage / tuition)" },
  { value: "prior-return", label: "Prior-year tax return" },
  { value: "id", label: "ID / passport / visa" },
  { value: "bank", label: "Bank or foreign account statement" },
  { value: "irs-notice", label: "IRS or state notice" },
  { value: "business", label: "Business income & expenses" },
  { value: "other", label: "Other" },
] as const;

export const documentTypeLabel = (v: string | null | undefined) => documentTypes.find((t) => t.value === v)?.label.split(" (")[0] ?? "Other";

export const portalTaxYears = (() => {
  const y = new Date().getFullYear();
  return [y, y - 1, y - 2, y - 3, y - 4].map(String);
})();

export const draftStatusLabel = {
  awaiting_review: "Awaiting your review",
  approved: "Approved",
  changes_requested: "Changes requested",
} as const;
