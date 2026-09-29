import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifiedToast } from "@/components/auth/verified-toast";

export const metadata: Metadata = { title: "Client Dashboard", robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Suspense fallback={null}>
        <VerifiedToast />
      </Suspense>
      {children}
    </div>
  );
}
