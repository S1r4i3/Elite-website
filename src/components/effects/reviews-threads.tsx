"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const WebThreads = dynamic(() => import("./web-threads"), { ssr: false });

/** Brand-red flowing threads behind the reviews card(s). Reacts to the mouse anywhere in the section. */
export function ReviewsThreads() {
  const ref = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<HTMLElement | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setSection(ref.current?.closest("section") ?? null);
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-screen -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect]" aria-hidden>
      {section && (
        <WebThreads
          color1="#C8102E"
          color2="#FF6B78"
          color3="#1B1F24"
          speed={reduce ? 0 : 0.2}
          threadCount={6}
          frequency={5}
          spread={0.18}
          taper={1}
          position={0.5}
          fanMode="center"
          glow={0.018}
          falloff={0.6}
          thickness={1.1}
          brightness={0.82}
          opacity={1}
          mirror
          shimmer={false}
          grain
          grainIntensity={0.015}
          mouseInteraction={!reduce}
          mouseStrength={0.3}
          mouseTarget={section}
          lightMode
          backgroundColor="#F4F5F7"
        />
      )}
    </div>
  );
}
