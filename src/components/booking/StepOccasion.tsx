"use client";
import { motion } from "framer-motion";
import { OCCASIONS } from "@/lib/data/occasions";
import { useBooking } from "@/store/booking";
import { cn } from "@/lib/utils";

export default function StepOccasion() {
  const { occasion, set, next } = useBooking();
  return (
    <div>
      <h2 className="font-display text-h2 font-semibold">Kya hai <span className="text-gradient">occasion?</span></h2>
      <p className="mt-2 text-muted">Pick one. We&apos;ll match reelers who nail that vibe.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {OCCASIONS.map((o, i) => {
          const on = occasion === o.name;
          return (
            <motion.button key={o.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}
              onClick={() => { set({ occasion: o.name }); setTimeout(next, 220); }}
              className={cn("group relative rounded-3xl p-5 text-left border transition-all", on ? "bg-brand text-white border-transparent shadow-glow" : "glass border-fg/10 hover:border-pink/50")}>
              <span className="text-3xl block">{o.emoji}</span>
              <span className="mt-3 block font-display text-lg font-semibold leading-tight">{o.name}</span>
              <span className={cn("block text-xs mt-0.5", on ? "text-white/80" : "text-muted")}>{o.hinglish}</span>
              {on && <motion.span layoutId="occ-check" className="absolute right-3 top-3 h-6 w-6 rounded-full bg-white text-pink flex items-center justify-center text-xs font-bold">✓</motion.span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
