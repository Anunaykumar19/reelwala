"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function CountUp({ value, decimals = 0, suffix = "", prefix = "", className }: { value: number; decimals?: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = prefix + v.toFixed(decimals) + suffix; }), [spring, decimals, suffix, prefix]);
  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
