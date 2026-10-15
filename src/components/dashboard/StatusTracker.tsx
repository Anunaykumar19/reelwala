"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { BOOKING_STEPS, statusIndex } from "@/lib/status";
import { cn } from "@/lib/utils";
import Countdown from "./Countdown";

export default function StatusTracker({ status, slaDeadline, compact }: { status: string; slaDeadline?: string | null; compact?: boolean }) {
  const idx = statusIndex(status);
  const cancelled = status === "CANCELLED" || status === "REFUNDED";
  return (
    <div className={cn(cancelled && "opacity-50")}>
      <ol className="flex items-center">
        {BOOKING_STEPS.map((s, i) => {
          const done = i < idx || status === "DELIVERED"; const cur = i === idx && status !== "DELIVERED";
          return (
            <li key={s.key} className="flex-1 flex items-center min-w-0">
              <div className="flex flex-col items-center gap-1.5 text-center min-w-0">
                <motion.span initial={false} animate={{ scale: cur ? 1.1 : 1 }} className={cn("h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0", done ? "bg-brand text-white" : cur ? "bg-bg border-2 border-cyan text-cyan shadow-glow-sm" : "bg-fg/10 text-muted")}>{done ? <Check size={14} strokeWidth={3} /> : i + 1}</motion.span>
                {!compact && <span className={cn("text-[10px] leading-tight", done || cur ? "text-fg" : "text-muted")}>{s.label}</span>}
              </div>
              {i < BOOKING_STEPS.length - 1 && <span className={cn("mx-1 h-0.5 flex-1 rounded-full", i < idx || status === "DELIVERED" ? "bg-brand" : "bg-fg/10")} />}
            </li>
          );
        })}
      </ol>
      {(status === "SHOOT_DONE" || status === "EDITING") && slaDeadline && (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-pink/10 border border-pink/30 px-3 py-2 text-xs"><span className="text-pink font-semibold">24-hr delivery timer</span><Countdown to={slaDeadline} className="font-display text-base font-semibold" /></div>
      )}
    </div>
  );
}
