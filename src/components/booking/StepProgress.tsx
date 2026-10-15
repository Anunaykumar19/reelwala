"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = ["Occasion", "When & where", "Package", "Reeler", "Details", "Pay"];

export default function StepProgress({ step, onJump }: { step: number; onJump?: (i: number) => void }) {
  const pct = (step / (STEPS.length - 1)) * 100;
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-fg/10 overflow-hidden">
        <motion.div className="h-full bg-brand bg-[length:200%_100%] animate-shimmer" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <ol className="relative flex justify-between">
        {STEPS.map((s, i) => {
          const done = i < step, active = i === step;
          return (
            <li key={s} className="flex flex-col items-center gap-2">
              <button disabled={i > step} onClick={() => onJump?.(i)} aria-current={active ? "step" : undefined}
                className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2", done ? "bg-brand border-transparent text-white" : active ? "bg-bg border-pink text-fg shadow-glow-sm scale-110" : "bg-bg border-fg/15 text-muted")}>
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </button>
              <span className={cn("hidden sm:block text-[11px] font-medium", active ? "text-fg" : "text-muted")}>{s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
