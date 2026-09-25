"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Site-wide motion, driven by data attributes (no libraries):
 *  - data-parallax="0.2" suppressHydrationWarning   scroll parallax (positive = moves slower than the page, negative = faster)
 *  - data-depth="20" suppressHydrationWarning       moves with the mouse (px at the screen edge)
 *  - data-tilt             3D tilt toward the cursor on hover
 *  - data-magnetic         element is pulled slightly toward the cursor
 * Everything is off for visitors who prefer reduced motion; mouse effects only run on mouse devices.
 */
export function MotionEffects() {
  const pathname = usePathname();

  // Wait until the page has finished loading/hydrating before touching element styles.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => window.setTimeout(() => setReady(true), 300);
    if (document.readyState === "complete") {
      const t = go();
      return () => clearTimeout(t);
    }
    let t = 0;
    const onLoad = () => (t = go());
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let parallax: HTMLElement[] = [];
    let depth: HTMLElement[] = [];
    const collect = () => {
      parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      depth = finePointer ? Array.from(document.querySelectorAll<HTMLElement>("[data-depth]")) : [];
    };
    collect();
    // Pick up elements rendered later (lazy sections, the hero video, etc.)
    let pending = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(pending);
      pending = window.setTimeout(() => {
        collect();
        schedule();
      }, 150);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    let mx = 0;
    let my = 0; // pointer, -1..1 from screen center
    let smx = 0;
    let smy = 0;
    let raf = 0;
    let running = true;

    const frame = () => {
      if (!running) return;
      const vh = window.innerHeight;
      for (const el of parallax) {
        const speed = parseFloat(el.dataset.parallax || "0");
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      }
      smx += (mx - smx) * 0.08;
      smy += (my - smy) * 0.08;
      for (const el of depth) {
        const d = parseFloat(el.dataset.depth || "0");
        el.style.translate = `${(smx * d).toFixed(1)}px ${(smy * d).toFixed(1)}px`;
      }
      // Keep animating only while the mouse-depth smoothing is still settling.
      const settling = depth.length > 0 && Math.abs(mx - smx) + Math.abs(my - smy) > 0.002;
      raf = settling ? requestAnimationFrame(frame) : 0;
    };
    const schedule = () => {
      if (!raf && running) raf = requestAnimationFrame(frame);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (depth.length) schedule();
    };

    // Tilt + magnetic (event delegation so it works on newly rendered elements too)
    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;
    const onPointer = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const t = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tiltEl && tiltEl !== t) {
        tiltEl.style.transform = "";
        tiltEl = null;
      }
      if (t) {
        tiltEl = t;
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = parseFloat(t.dataset.tilt || "") || 6;
        t.style.transition = "transform 120ms ease-out";
        t.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      }
      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magEl && magEl !== m) {
        magEl.style.transform = "";
        magEl = null;
      }
      if (m) {
        magEl = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transition = "transform 150ms ease-out";
        m.style.transform = `translate(${(dx * 0.25).toFixed(1)}px, ${(dy * 0.35).toFixed(1)}px)`;
      }
    };
    const onLeaveWindow = () => {
      if (tiltEl) tiltEl.style.transform = "";
      if (magEl) magEl.style.transform = "";
      tiltEl = magEl = null;
    };

    if (finePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mousemove", onPointer, { passive: true });
      document.addEventListener("mouseleave", onLeaveWindow);
    }
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      clearTimeout(pending);
      mo.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", onPointer);
      document.removeEventListener("mouseleave", onLeaveWindow);
      for (const el of parallax) el.style.transform = "";
      for (const el of depth) el.style.translate = "";
    };
  }, [pathname, ready]);

  return null;
}
