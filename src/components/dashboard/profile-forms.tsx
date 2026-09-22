"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/auth-form";

type Profile = { firstName: string; lastName: string; email: string; phone: string; dob: string; state: string; country: string; address: string };

function Msg({ m }: { m: { ok: boolean; text: string } | null }) {
  if (!m) return null;
  return (
    <p role="status" className={`flex items-center gap-2 text-sm ${m.ok ? "text-success-700" : "text-danger-600"}`}>
      {m.ok && <CheckCircle2 className="size-4" aria-hidden />} {m.text}
    </p>
  );
}

export function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const field = (k: keyof Profile, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <Label htmlFor={`p-${k}`}>{label}</Label>
      <Input id={`p-${k}`} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} {...props} />
    </div>
  );
  return (
    <form
      className="card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        const { email: _e, ...body } = v;
        const res = await fetch("/api/me/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
        const json = await res.json().catch(() => ({}));
        setBusy(false);
        setMsg(res.ok ? { ok: true, text: "Profile saved." } : { ok: false, text: json.error || "Couldn't save." });
        if (res.ok) router.refresh();
      }}
    >
      <h2 className="text-lg font-bold">Personal details</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { autoComplete: "given-name" })}
        {field("lastName", "Last name", { autoComplete: "family-name" })}
        <div>
          <Label htmlFor="p-email">Email</Label>
          <Input id="p-email" value={v.email} disabled />
        </div>
        {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
        {field("dob", "Date of birth", { type: "date" })}
        {field("state", "State")}
        {field("country", "Country")}
        {field("address", "Address")}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Save changes
        </Button>
        <Msg m={msg} />
      </div>
    </form>
  );
}

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [cf, setCf] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      className="card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        const res = await fetch("/api/me/password", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ currentPassword: cur, newPassword: pw, confirmPassword: cf }),
        });
        const json = await res.json().catch(() => ({}));
        setBusy(false);
        if (!res.ok) return setMsg({ ok: false, text: json.error || "Couldn't update password." });
        setCur("");
        setPw("");
        setCf("");
        setMsg({ ok: true, text: "Password updated." });
      }}
    >
      <h2 className="text-lg font-bold">Change password</h2>
      <div className="mt-5 space-y-4">
        {hasPassword && (
          <div>
            <Label htmlFor="cur">Current password</Label>
            <PasswordInput id="cur" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} required />
          </div>
        )}
        <div>
          <Label htmlFor="npw">New password</Label>
          <PasswordInput id="npw" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          <p className="mt-1.5 text-xs text-subtle">8+ characters with a letter and a number.</p>
        </div>
        <div>
          <Label htmlFor="cpw">Confirm new password</Label>
          <PasswordInput id="cpw" autoComplete="new-password" value={cf} onChange={(e) => setCf(e.target.value)} required />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="dark" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : <KeyRound aria-hidden />} Update password
        </Button>
        <Msg m={msg} />
      </div>
    </form>
  );
}
