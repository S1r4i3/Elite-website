import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmail } from "@/components/auth/verify-email";

export const metadata: Metadata = { title: "Verify email", robots: { index: false, follow: false } };

export default function VerifyEmailPage() {
  return (
    <section className="bg-canvas">
      <div className="container-x grid min-h-[60vh] place-items-center py-14">
        <div className="card w-full max-w-lg p-8 text-center sm:p-12">
          <Suspense>
            <VerifyEmail />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
