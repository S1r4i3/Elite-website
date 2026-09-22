"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Galaxy = dynamic(() => import("./galaxy"), { ssr: false });

/**
 * Brand-tinted interactive starfield behind the services section (desktop / mouse devices).
 * Phones and tablets get a lightweight static star pattern instead, to keep scrolling smooth and save battery.
 */
export function ServicesGalaxy() {
  const [mode, setMode] = useState<"none" | "static" | "live">("none");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches;
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMode(fine ? "live" : "static");
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      {mode === "static" && <div className="static-stars absolute inset-0" />}
      {mode === "live" && (
        <Galaxy
          className="absolute inset-0"
          mouseRepulsion
          mouseInteraction
          density={1.2}
          glowIntensity={0.35}
          saturation={0.4}
          hueShift={220}
          twinkleIntensity={0.4}
          rotationSpeed={0.04}
          repulsionStrength={2}
          starSpeed={0.4}
          speed={0.8}
          transparent
          disableAnimation={reduce}
        />
      )}
    </div>
  );
}
