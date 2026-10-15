"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Star, Zap, Wand2, Check } from "lucide-react";
import { useBooking } from "@/store/booking";
import { cn, inr } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import ReelCard from "@/components/reels/ReelCard";
import { useUI } from "@/store/ui";
import { PACKAGES } from "@/lib/data/packages";

type R = { slug: string; name: string; avatar: string; area: string; rating: number; reviews: number; responseTime: string; tags: string[]; reels: string[]; packages: { key: string; price: number }[]; delivered: number };

export default function StepReeler() {
  const b = useBooking();
  const openViewer = useUI((s) => s.openViewer);
  const [list, setList] = useState<R[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setList(null); setErr("");
    fetch(`/api/reelers/available?city=${encodeURIComponent(b.city)}&date=${b.date}&start=${b.startTime}&hours=${b.durationHrs}`)
      .then((r) => r.json()).then((d) => setList(d.reelers || [])).catch(() => setErr("Could not load reelers"));
  }, [b.city, b.date, b.startTime, b.durationHrs]);

  const sorted = list ? [...list].sort((x, y) => (x.tags.includes(b.occasion) ? -1 : 0) - (y.tags.includes(b.occasion) ? -1 : 0) || y.rating - x.rating) : null;
  const canNext = b.autoAssign || !!b.reelerSlug;

  return (
    <div>
      <h2 className="font-display text-h2 font-semibold">Apna <span className="text-gradient">Reeler</span> chuno.</h2>
      <p className="mt-2 text-muted">Available in {b.city} on {b.date} at {b.startTime}. Tap reels to watch.</p>

      <button onClick={() => b.set({ autoAssign: !b.autoAssign, reelerSlug: null })} className={cn("mt-6 w-full flex items-center gap-4 rounded-3xl p-4 border text-left transition-all", b.autoAssign ? "bg-brand text-white border-transparent shadow-glow" : "glass border-fg/10 hover:border-pink/40")}>
        <span className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", b.autoAssign ? "bg-white/20" : "bg-brand text-white")}><Wand2 size={20} /></span>
        <div className="flex-1"><p className="font-display text-lg font-semibold">Let Reelwala assign the best reeler</p><p className={cn("text-xs", b.autoAssign ? "text-white/80" : "text-muted")}>We match on occasion, rating and distance. Confirmed within 15 minutes.</p></div>
        <span className={cn("h-7 w-12 rounded-full p-0.5 transition-colors shrink-0", b.autoAssign ? "bg-white/30" : "bg-fg/15")}><motion.span animate={{ x: b.autoAssign ? 20 : 0 }} className="block h-6 w-6 rounded-full bg-white shadow" /></span>
      </button>

      <div className={cn("mt-6 transition-opacity", b.autoAssign && "opacity-40 pointer-events-none")}>
        {err && <p className="text-sm text-orange">{err}</p>}
        {!sorted && <div className="grid gap-4 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-56 rounded-3xl skeleton" />)}</div>}
        {sorted && sorted.length === 0 && <div className="glass rounded-3xl p-8 text-center"><p className="font-display text-xl font-semibold">Koi reeler free nahi is slot pe 😅</p><p className="text-sm text-muted mt-1">Try a different time, or toggle auto-assign and we&apos;ll find someone nearby.</p></div>}
        <AnimatePresence>
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted?.map((r, i) => { const on = b.reelerSlug === r.slug; const pk = r.packages.find((p) => p.key === b.packageKey)?.price ?? PACKAGES.find((p) => p.id === b.packageKey)!.price; const match = r.tags.includes(b.occasion); return (
              <motion.div key={r.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => b.set({ reelerSlug: on ? null : r.slug, autoAssign: false })}
                className={cn("relative cursor-pointer rounded-3xl p-3 border transition-all", on ? "glass gradient-border shadow-glow" : "glass border-fg/10 hover:border-fg/30")}>
                <div className="grid grid-cols-3 gap-1.5">{r.reels.slice(0, 3).map((s, k) => <ReelCard key={s + k} src={s} autoplay="hover" showControls={false} rounded="rounded-xl" onClick={() => openViewer(r.reels.map((x) => ({ src: x, reelerSlug: r.slug, reelerName: r.name })), k)} />)}</div>
                <div className="mt-3 flex items-center gap-3 px-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-pink/50" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold flex items-center gap-1 truncate">{r.name} <BadgeCheck size={14} className="text-cyan" /></p>
                    <p className="text-[11px] text-muted truncate">{r.area} · <Zap size={10} className="inline text-orange" /> {r.responseTime} · {r.delivered} reels</p>
                  </div>
                  <div className="text-right"><p className="text-sm font-semibold flex items-center gap-1 justify-end"><Star size={12} className="fill-orange text-orange" />{r.rating.toFixed(1)}</p><p className="text-[11px] text-muted">{inr(pk)}</p></div>
                </div>
                {match && <span className="absolute left-3 top-3 rounded-full bg-cyan/90 px-2 py-0.5 text-[10px] font-bold text-black">{b.occasion} pro</span>}
                {on && <span className="absolute right-3 top-3 h-7 w-7 rounded-full bg-brand text-white flex items-center justify-center"><Check size={14} strokeWidth={3} /></span>}
              </motion.div>); })}
          </div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={b.back} className="text-sm text-muted hover:text-fg">← Back</button>
        <MagneticButton onClick={b.next} disabled={!canNext}>Your details →</MagneticButton>
      </div>
    </div>
  );
}
