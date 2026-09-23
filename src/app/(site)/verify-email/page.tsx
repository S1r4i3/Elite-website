import { privatePageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { VerifyEmail } from "@/components/auth/verify-email";

export const metadata = privatePageMetadata({
  title: "Verify email",
  description: "Confirm your email address to activate your Elite Tax Services client portal account.",
  path: "/verify-email",
});

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
