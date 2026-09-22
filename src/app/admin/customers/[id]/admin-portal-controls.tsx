"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect, Textarea } from "@/components/ui/input";
import { portalTaxYears } from "@/lib/portal";
import { acceptedExtensions } from "@/lib/validation/upload";

export function AdminUploadForm({ customerId }: { customerId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<"draft" | "final">("draft");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <form
      className="card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        if (!(form.get("file") as File)?.size) return setMsg({ ok: false, text: "Choose a file first." });
        setBusy(true);
        setMsg(null);
        const res = await fetch(`/api/admin/customers/${customerId}/documents`, { method: "POST", body: form });
        const json = await res.json().catch(() => ({}));
        setBusy(false);
        if (!res.ok) return setMsg({ ok: false, text: json.error || "Upload failed." });
        (e.target as HTMLFormElement).reset();
        setKind("draft");
        setMsg({ ok: true, text: "Shared with the client." });
        router.refresh();
      }}
    >
      <h2 className="text-lg font-bold">Share with client</h2>
      <p className="mt-1 text-sm text-muted">Upload a draft estimate for the client to review, or a final document.</p>
      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="kind">Type</Label>
          <NativeSelect id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value as "draft" | "final")}>
            <option value="draft">Draft estimation (client reviews & approves)</option>
            <option value="final">Final document</option>
          </NativeSelect>
        </div>
        <div>
          <Label htmlFor="ty">Tax year</Label>
          <NativeSelect id="ty" name="taxYear" defaultValue={portalTaxYears[0]}>
            {portalTaxYears.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <Label htmlFor="file">File</Label>
          <input ref={fileRef} id="file" name="file" type="file" accept={acceptedExtensions.join(",")} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:font-semibold file:text-brand-700" />
        </div>
        <div>
          <Label htmlFor="note">Note to client (optional)</Label>
          <Textarea id="note" name="note" placeholder={kind === "draft" ? "e.g. Estimated federal refund $2,140. Please confirm your dependents." : "e.g. Your return was accepted by the IRS on…"} />
        </div>
      </div>
      {msg && <p className={`mt-4 text-sm ${msg.ok ? "text-success-700" : "text-danger-600"}`}>{msg.text}</p>}
      <Button type="submit" className="mt-5 w-full" disabled={busy}>
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : <UploadCloud aria-hidden />} Upload & share
      </Button>
    </form>
  );
}

export function AdminDeleteDoc({ id }: { id: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!confirm)
    return (
      <button type="button" onClick={() => setConfirm(true)} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-danger-50 hover:text-danger-600" aria-label="Delete">
        <Trash2 className="size-4" aria-hidden />
      </button>
    );
  return (
    <span className="flex gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await fetch(`/api/admin/portal-documents/${id}`, { method: "DELETE" });
          router.refresh();
        }}
        className="h-9 rounded-lg bg-danger-600 px-3 text-sm font-medium text-white"
      >
        {busy ? "…" : "Delete"}
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="h-9 rounded-lg px-3 text-sm text-muted hover:bg-canvas">
        Cancel
      </button>
    </span>
  );
}
