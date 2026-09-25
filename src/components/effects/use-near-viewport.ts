"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the element comes within `margin` of the viewport (and stays true).
 * Used to defer loading heavy WebGL effects until the visitor scrolls near them.
 */
export function useNearViewport(ref: RefObject<Element | null>, margin = "300px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
}
