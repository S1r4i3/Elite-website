"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const viewable = (name: string) => /\.(pdf|png|jpe?g)$/i.test(name);

export function DocActions({ id, name, canDelete = false, className }: { id: string; name: string; canDelete?: boolean; className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const btn = "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {viewable(name) && (
        <a href={`/api/me/documents/${id}?view=1`} target="_blank" rel="noopener" className={cn(btn, "text-muted hover:bg-canvas hover:text-navy-900")} aria-label={`View ${name}`}>
          <Eye className="size-4" aria-hidden /> <span className="hidden sm:inline">View</span>
        </a>
      )}
      <a href={`/api/me/documents/${id}`} className={cn(btn, "text-brand-600 hover:bg-brand-50")} aria-label={`Download ${name}`}>
        <Download className="size-4" aria-hidden /> <span className="hidden sm:inline">Download</span>
      </a>
      {canDelete &&
        (confirm ? (
          <span className="flex items-center gap-1">
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await fetch(`/api/me/documents/${id}`, { method: "DELETE" }).catch(() => {});
                setBusy(false);
                setConfirm(false);
                router.refresh();
              }}
              className={cn(btn, "bg-danger-600 text-white hover:bg-danger-600/90")}
            >
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "Delete"}
            </button>
            <button type="button" onClick={() => setConfirm(false)} className={cn(btn, "text-muted hover:bg-canvas")}>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className={cn(btn, "text-muted hover:bg-danger-50 hover:text-danger-600")} aria-label={`Delete ${name}`}>
            <Trash2 className="size-4" aria-hidden />
          </button>
        ))}
    </div>
  );
}
