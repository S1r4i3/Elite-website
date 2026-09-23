"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo({ src = "/videos/hero" }: { src?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!reduce && !saveData) setEnabled(true);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 -top-[12%] h-[124%]" data-parallax="0.3" suppressHydrationWarning aria-hidden>
      <video
        ref={ref}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={`${src}.jpg`}
        onPlaying={() => setPlaying(true)}
        onError={() => setPlaying(false)}
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
      {/* Brand-tinted overlays keep headline text readable over any footage */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "linear-gradient(90deg, rgb(18 21 24 / 0.92) 0%, rgb(18 21 24 / 0.78) 45%, rgb(18 21 24 / 0.55) 100%), linear-gradient(0deg, rgb(18 21 24 / 0.85) 0%, transparent 35%), radial-gradient(ellipse 60% 50% at 10% 90%, rgb(200 16 46 / 0.25), transparent 60%)",
        }}
      />
    </div>
  );
}
