"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setError(json.error || "Sign-in failed");
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="card w-full max-w-sm p-8">
      <LogoMark className="h-10" />
      <h1 className="mt-5 text-2xl font-extrabold">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted">Elite Tax lead management</p>
      <div className="mt-6">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-invalid={!!error} aria-describedby={error ? "pw-error" : undefined} />
        {error && (
          <p id="pw-error" className="mt-2 text-sm text-danger-600" role="alert">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" aria-hidden /> : <Lock aria-hidden />} Sign in
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
