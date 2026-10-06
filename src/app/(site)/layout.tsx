import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Suspense } from "react";
import { VerifiedToast } from "@/components/auth/verified-toast";
import { DeferredExtras } from "@/components/effects/deferred-extras";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Suspense>
        <VerifiedToast />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
      <MobileCta />
      <WhatsAppButton />
      <DeferredExtras />
    </>
  );
}
