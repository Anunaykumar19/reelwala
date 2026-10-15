"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useUI } from "@/store/ui";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/useMedia";

export default function Cursor() {
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const { label, hover } = useUI((s) => s.cursor);
  const setCursor = useUI((s) => s.setCursor);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (touch || reduced) return;
    document.body.classList.add("has-cursor");
    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      if (dot.current) dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role=button], input, textarea, select, label");
      if (!t) return setCursor({ hover: false, label: null });
      setCursor({ hover: true, label: t.dataset.cursor || null });
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [touch, reduced, x, y, setCursor]);

  if (touch || reduced) return null;
  const big = !!label;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-fg mix-blend-difference" />
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center"
      >
        <motion.div
          animate={{ width: big ? 76 : hover ? 44 : 28, height: big ? 76 : hover ? 44 : 28, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-[11px] font-semibold uppercase tracking-wider ${
            big ? "bg-brand text-white shadow-glow" : "border border-fg/60 mix-blend-difference"
          }`}
        >
          {label}
        </motion.div>
      </motion.div>
    </>
  );
}
