"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { leadStatuses, type LeadStatus } from "@/lib/db/types";

export function StatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  return (
    <select
      aria-label="Lead status"
      value={value}
      disabled={pending}
      onChange={async (e) => {
        const next = e.target.value as LeadStatus;
        const prev = value;
        setValue(next);
        setError(false);
        const res = await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: next }) });
        if (!res.ok) {
          setValue(prev);
          setError(true);
        }
        start(() => router.refresh());
      }}
      className={`h-9 rounded-lg border bg-white px-2 text-sm capitalize ${error ? "border-danger-600" : "border-line-strong"}`}
    >
      {leadStatuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
      }}
    >
      <LogOut aria-hidden /> Sign out
    </Button>
  );
}
