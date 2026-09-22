import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Suspense } from "react";
import { VerifiedToast } from "@/components/auth/verified-toast";
import { MotionEffects } from "@/components/effects/motion-effects";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { InquiryPopup } from "@/components/layout/inquiry-popup";

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
      <MotionEffects />
      <CustomCursor />
      <InquiryPopup />
    </>
  );
}
