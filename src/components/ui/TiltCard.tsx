"use client";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsTouch } from "@/hooks/useMedia";

export default function TiltCard({ children, className, intensity = 10, glow = true }: { children: ReactNode; className?: string; intensity?: number; glow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glowBg = useTransform([gx, gy], ([x, y]) => `radial-gradient(300px circle at ${x} ${y}, rgba(236,72,153,.22), transparent 60%)`);

  const onMove = (e: MouseEvent) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { px.set(0.5); py.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn("relative group will-change-transform", className)}
    >
      {children}
      {glow && (
        <motion.div
          aria-hidden
          style={{ background: glowBg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </motion.div>
  );
}
