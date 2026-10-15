"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Check } from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { OCCASIONS } from "@/lib/data/occasions";
import { LIVE_CITIES } from "@/lib/data/cities";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const BUDGETS = ["₹999–1,999", "₹2,000–4,999", "₹5,000+", "Not sure"];

export default function QuickBookForm({ onDone, compact }: { onDone?: () => void; compact?: boolean }) {
  const [form, setForm] = useState({ occasion: "", date: "", city: "Delhi NCR", phone: "", budget: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const valid = form.occasion && form.date && form.city && /^\d{10}$/.test(form.phone) && form.budget;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return toast.error("Sab fields bhar do, phone 10 digits.");
    setLoading(true);
    try {
      const res = await fetch("/api/quick-book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setDone(true);
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#7C3AED", "#EC4899", "#F97316", "#22D3EE"] });
    } catch { toast.error("Kuch gadbad ho gayi. Try again?"); } finally { setLoading(false); }
  };

  if (done) return (
    <div className="py-8 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="mx-auto mb-5 h-20 w-20 rounded-full bg-brand flex items-center justify-center shadow-glow"><Check size={36} className="text-white" /></motion.div>
      <h3 className="font-display text-h3 font-semibold">Request mil gayi! 🎉</h3>
      <p className="mt-2 text-muted">We&apos;ll assign the best Reeler for your {form.occasion.toLowerCase()} in {form.city} and call you on +91 {form.phone} within <span className="text-fg font-semibold">15 minutes</span>.</p>
      <MagneticButton className="mt-6" onClick={() => { setDone(false); onDone?.(); }}>Done</MagneticButton>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink flex items-center gap-1"><Zap size={12} /> Quick book</p>
      {!compact && <h3 className="font-display text-h3 font-semibold mt-1">Book in 60 seconds</h3>}
      <p className="text-sm text-muted mt-1">Hum best Reeler assign karenge aur 15 min me call karenge.</p>

      <label className="block mt-6 text-xs font-semibold text-muted uppercase tracking-wider">Occasion</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {OCCASIONS.slice(0, 8).map((o) => (
          <button type="button" key={o.slug} onClick={() => setForm({ ...form, occasion: o.name })} className={cn("rounded-full px-3 py-1.5 text-sm border transition-all", form.occasion === o.name ? "bg-brand text-white border-transparent shadow-glow-sm" : "border-fg/15 hover:border-fg/40")}>{o.emoji} {o.name}</button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold text-muted uppercase tracking-wider">Date</label><input type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-2 h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50" /></div>
        <div><label className="text-xs font-semibold text-muted uppercase tracking-wider">City</label><select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-2 h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50">{LIVE_CITIES.map((c) => <option key={c.slug}>{c.name}</option>)}</select></div>
      </div>
      <label className="block mt-5 text-xs font-semibold text-muted uppercase tracking-wider">Phone (WhatsApp)</label>
      <div className="mt-2 flex h-12 items-center rounded-2xl bg-surface-2 border border-fg/10 focus-within:ring-2 focus-within:ring-pink/50"><span className="px-4 text-sm text-muted border-r border-fg/10">+91</span><input inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} placeholder="98765 43210" className="h-full flex-1 bg-transparent px-4 text-sm outline-none" /></div>
      <label className="block mt-5 text-xs font-semibold text-muted uppercase tracking-wider">Budget</label>
      <div className="mt-2 grid grid-cols-2 gap-2">{BUDGETS.map((b) => <button type="button" key={b} onClick={() => setForm({ ...form, budget: b })} className={cn("rounded-2xl px-3 py-2.5 text-sm border transition-all", form.budget === b ? "bg-brand text-white border-transparent" : "border-fg/15 hover:border-fg/40")}>{b}</button>)}</div>
      <div className="mt-6">
        <MagneticButton type="submit" size="lg" className="w-full" glow disabled={loading}>{loading ? "Sending…" : "Get a Reeler in 15 mins →"}</MagneticButton>
        <p className="mt-3 text-center text-[11px] text-muted">No payment now. Free cancellation 24 hrs before shoot.</p>
      </div>
    </form>
  );
}
