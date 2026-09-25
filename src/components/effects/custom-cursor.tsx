"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Classic "dot + trailing ring" cursor.
 * - The dot follows the pointer exactly; the ring glides behind it.
 * - Over links/buttons the ring grows and fills; over [data-cursor="Label"] it shows the label.
 * - Hidden over text fields (normal text cursor there). Mouse devices only; off for reduced motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    document.documentElement.classList.add("custom-cursor-on");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let visible = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      d.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      // Stop when the ring has caught up — no work at all while the mouse is still.
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const setState = (target: Element | null) => {
      const field = target?.closest("input, textarea, select, [contenteditable='true']");
      const label = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const interactive = target?.closest("a, button, [role='button'], [role='tab'], label, summary, [data-magnetic]");
      r.dataset.state = field ? "text" : label ? "label" : interactive ? "hover" : "";
      r.dataset.label = label ?? "";
      d.dataset.state = field ? "text" : interactive || label ? "hover" : "";
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        d.style.opacity = r.style.opacity = "1";
      }
      setState(e.target as Element);
      kick();
    };
    const onDown = () => r.classList.add("is-down");
    const onUp = () => r.classList.remove("is-down");
    const onLeave = () => {
      visible = false;
      d.style.opacity = r.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-on");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
