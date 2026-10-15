"use client";
import { motion } from "framer-motion";
import { Check, Minus, Plus, Sparkles } from "lucide-react";
import { PACKAGES, ADDONS } from "@/lib/data/packages";
import { useBooking } from "@/store/booking";
import { cn, inr } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import TiltCard from "@/components/ui/TiltCard";

export default function StepPackage() {
  const b = useBooking();
  return (
    <div>
      <h2 className="font-display text-h2 font-semibold">Package <span className="text-gradient">chuno.</span></h2>
      <p className="mt-2 text-muted">All include trending audio, captions, 24-hr delivery and a free revision.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PACKAGES.map((p) => { const on = b.packageKey === p.id; return (
          <TiltCard key={p.id} intensity={5} className="rounded-3xl">
            <button onClick={() => b.set({ packageKey: p.id, durationHrs: p.hours })} className={cn("relative w-full h-full text-left rounded-3xl p-5 border transition-all", on ? "glass gradient-border shadow-glow" : "glass border-fg/10 hover:border-fg/30")}>
              {p.popular && <span className="absolute -top-2.5 left-5 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1"><Sparkles size={10} /> Popular</span>}
              <div className="flex items-start justify-between">
                <div><p className="font-display text-xl font-semibold">{p.name}</p><p className="text-xs text-muted">{p.hours} hr · {p.reels}{p.id === "event" ? "+" : ""} reels</p></div>
                <span className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center", on ? "bg-brand border-transparent text-white" : "border-fg/20")}>{on && <Check size={12} strokeWidth={3} />}</span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold">{inr(p.price)}<span className="text-sm text-muted font-medium">{p.id === "event" ? "+" : ""}</span></p>
              <ul className="mt-3 space-y-1 text-xs text-muted">{p.features.slice(0, 4).map((f) => <li key={f}>· {f}</li>)}</ul>
            </button>
          </TiltCard>); })}
      </div>

      <h3 className="mt-10 font-display text-xl font-semibold">Add-ons</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ADDONS.filter((a) => a.id !== "extra-reel").map((a) => { const on = !!b.addons[a.id]; return (
          <motion.button key={a.id} whileTap={{ scale: 0.98 }} onClick={() => b.set({ addons: { ...b.addons, [a.id]: !on } })} className={cn("flex items-center justify-between rounded-2xl p-4 border text-left transition-all", on ? "bg-pink/10 border-pink/50" : "glass border-fg/10 hover:border-fg/30")}>
            <div><p className="font-semibold text-sm">{a.name}</p><p className="text-xs text-muted">{a.desc}</p></div>
            <div className="flex items-center gap-3"><span className="font-display font-semibold">+{inr(a.price)}</span><span className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center", on ? "bg-brand border-transparent text-white" : "border-fg/20")}>{on && <Check size={12} strokeWidth={3} />}</span></div>
          </motion.button>); })}
        <div className="flex items-center justify-between rounded-2xl p-4 border glass border-fg/10 sm:col-span-2">
          <div><p className="font-semibold text-sm">Extra reels</p><p className="text-xs text-muted">₹299 each. Ek aur reel? Done.</p></div>
          <div className="flex items-center rounded-full bg-fg/5">
            <button onClick={() => b.set({ extraReels: Math.max(0, b.extraReels - 1) })} className="h-9 w-9 flex items-center justify-center"><Minus size={14} /></button>
            <span className="w-8 text-center font-display font-semibold">{b.extraReels}</span>
            <button onClick={() => b.set({ extraReels: Math.min(10, b.extraReels + 1) })} className="h-9 w-9 flex items-center justify-center"><Plus size={14} /></button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={b.back} className="text-sm text-muted hover:text-fg">← Back</button>
        <MagneticButton onClick={b.next}>Pick a reeler →</MagneticButton>
      </div>
    </div>
  );
}
