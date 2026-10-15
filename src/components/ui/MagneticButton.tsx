"use client";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIsTouch } from "@/hooks/useMedia";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "glass" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function MagneticButton({ children, href, onClick, variant = "primary", size = "md", className, glow, type = "button", disabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  const onMove = (e: MouseEvent) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base = cn(
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-colors select-none whitespace-nowrap",
    size === "sm" && "h-10 px-5 text-sm",
    size === "md" && "h-12 px-7 text-[15px]",
    size === "lg" && "h-14 px-9 text-base",
    variant === "primary" && "bg-brand text-white",
    variant === "glass" && "glass text-fg hover:bg-fg/10",
    variant === "ghost" && "text-fg hover:bg-fg/5",
    variant === "white" && "bg-fg text-bg",
    glow && "glow-border",
    disabled && "opacity-50 pointer-events-none",
    className,
  );

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 bg-shimmer bg-[length:200%_100%] opacity-0 transition-opacity group-hover:opacity-100 group-hover:animate-shimmer" />
      )}
    </>
  );

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={reset} className="inline-block group">
      <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
        {href ? (
          <Link href={href} className={base} onClick={onClick}>{inner}</Link>
        ) : (
          <button type={type} className={base} onClick={onClick} disabled={disabled}>{inner}</button>
        )}
      </motion.div>
    </motion.div>
  );
}
