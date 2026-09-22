import { draftStatusLabel } from "@/lib/portal";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, staff = false }: { status: keyof typeof draftStatusLabel | null; staff?: boolean }) {
  if (!status) return null;
  const tone =
    status === "approved"
      ? "bg-success-50 text-success-700"
      : status === "changes_requested"
        ? "bg-warn-50 text-warn-700"
        : "bg-brand-50 text-brand-700";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", tone)}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "awaiting_review" && "animate-pulse")} aria-hidden />
      {staff && status === "awaiting_review" ? "Awaiting client review" : staff && status === "approved" ? "Approved by client" : draftStatusLabel[status]}
    </span>
  );
}
