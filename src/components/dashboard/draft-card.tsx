"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileSpreadsheet, Loader2, MessageSquareWarning, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { DocActions } from "./doc-actions";
import { StatusBadge } from "./status-badge";
import { cn, formatBytes } from "@/lib/utils";

type Draft = {
  id: string;
  name: string;
  size: number;
  taxYear: string | null;
  note: string | null;
  status: "awaiting_review" | "approved" | "changes_requested" | null;
  clientComment: string | null;
  createdAt: string;
};

export function DraftCard({ draft }: { draft: Draft }) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "changes">("idle");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState<"approve" | "changes" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (action: "approve" | "request_changes") => {
    setBusy(action === "approve" ? "approve" : "changes");
    setError(null);
    const res = await fetch(`/api/me/drafts/${draft.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action === "approve" ? { action } : { action, comment }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) return setError(json.error || "Something went wrong.");
    setMode("idle");
    setComment("");
    router.refresh();
  };

  return (
    <article className={cn("card overflow-hidden", draft.status === "awaiting_review" && "border-brand-200 ring-1 ring-brand-100")}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:p-6">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <FileSpreadsheet className="size-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold">{draft.name}</h3>
            <StatusBadge status={draft.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {draft.taxYear ? `Tax year ${draft.taxYear} · ` : ""}
            {formatBytes(draft.size)} · Shared {new Date(draft.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
          {draft.note && (
            <p className="mt-3 rounded-xl bg-canvas p-3 text-sm leading-relaxed text-ink">
              <span className="font-semibold text-navy-900">Note from your tax professional: </span>
              {draft.note}
            </p>
          )}
          {draft.status === "changes_requested" && draft.clientComment && (
            <p className="mt-3 rounded-xl border border-warn-700/20 bg-warn-50 p-3 text-sm text-warn-700">
              <span className="font-semibold">Your request: </span>
              {draft.clientComment}
            </p>
          )}
        </div>
        <DocActions id={draft.id} name={draft.name} className="shrink-0" />
      </div>

      {draft.status !== "approved" && (
        <div className="border-t border-line bg-canvas/50 p-5 sm:px-6">
          {mode === "changes" ? (
            <div>
              <label htmlFor={`c-${draft.id}`} className="text-sm font-semibold text-navy-900">
                What should we change?
              </label>
              <Textarea id={`c-${draft.id}`} className="mt-2 bg-white" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g. I also have a 1099-INT from my savings account that isn't included." />
              {error && <p className="mt-2 text-sm text-danger-600" role="alert">{error}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => act("request_changes")} disabled={!!busy || comment.trim().length < 3}>
                  {busy === "changes" && <Loader2 className="animate-spin" aria-hidden />} Send request
                </Button>
                <Button variant="ghost" onClick={() => setMode("idle")}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {draft.status === "changes_requested" ? "We're updating your draft. You can still approve this version." : "Please review the draft and let us know if it looks right."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setMode("changes")} disabled={!!busy}>
                  <MessageSquareWarning aria-hidden /> Request changes
                </Button>
                <Button onClick={() => act("approve")} disabled={!!busy} className="btn-shine">
                  {busy === "approve" ? <Loader2 className="animate-spin" aria-hidden /> : <ThumbsUp aria-hidden />} Approve draft
                </Button>
              </div>
              {error && <p className="text-sm text-danger-600" role="alert">{error}</p>}
            </div>
          )}
        </div>
      )}
      {draft.status === "approved" && (
        <p className="flex items-center gap-2 border-t border-line bg-success-50 px-5 py-3 text-sm font-medium text-success-700 sm:px-6">
          <CheckCircle2 className="size-4" aria-hidden /> You approved this draft. We&apos;ll prepare your final documents.
        </p>
      )}
    </article>
  );
}
