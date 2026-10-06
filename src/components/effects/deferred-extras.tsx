"use client";

import dynamic from "next/dynamic";

/**
 * Non-essential client extras (motion, custom cursor, inquiry pop-up) load in their own chunks after
 * hydration, so they never compete with the page's first render or main content for the main thread.
 */
const MotionEffects = dynamic(() => import("./motion-effects").then((m) => m.MotionEffects), { ssr: false });
const CustomCursor = dynamic(() => import("./custom-cursor").then((m) => m.CustomCursor), { ssr: false });
const InquiryPopup = dynamic(() => import("@/components/layout/inquiry-popup").then((m) => m.InquiryPopup), { ssr: false });

export function DeferredExtras() {
  return (
    <>
      <MotionEffects />
      <CustomCursor />
      <InquiryPopup />
    </>
  );
}
