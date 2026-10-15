"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ReelCard from "@/components/reels/ReelCard";
import { STATS, TESTIMONIALS } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export default function StatsTestimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (d: number) => { setDir(d); setI((x) => (x + d + TESTIMONIALS.length) % TESTIMONIALS.length); };
  const t = TESTIMONIALS[i];

  return (
    <section className="relative py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s, k) => (
            <Reveal key={s.label} delay={k * 0.08}>
              <div className="glass rounded-3xl p-6 border border-fg/10 text-center">
                <p className="font-display text-4xl md:text-5xl font-bold text-gradient"><CountUp value={s.value} suffix={s.suffix} decimals={s.decimals || 0} /></p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Reviews" title="Logon ne kya kaha" highlight="(sach me)" sub="Every review is from a verified completed booking. No paid reviews, no cousins." />
            <div className="relative mt-8 min-h-[220px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={i} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} transition={{ duration: 0.4 }} className="glass rounded-3xl p-6 border border-fg/10">
                  <Quote className="text-pink" size={22} />
                  <p className="mt-3 text-lg leading-relaxed">{t.text}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold flex items-center gap-1.5">{t.name} <BadgeCheck size={14} className="text-cyan" /></p>
                      <p className="text-xs text-muted">{t.occasion} · {t.city}</p>
                    </div>
                    <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={14} className="fill-orange text-orange" />)}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={() => go(-1)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-fg/10"><ChevronLeft size={18} /></button>
              <button onClick={() => go(1)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-fg/10"><ChevronRight size={18} /></button>
              <div className="flex gap-1.5 ml-2">{TESTIMONIALS.map((_, k) => <button key={k} onClick={() => { setDir(k > i ? 1 : -1); setI(k); }} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-6 bg-brand" : "w-1.5 bg-fg/20")} />)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {TESTIMONIALS.map((x, k) => (
              <motion.div key={x.name} animate={{ scale: k === i ? 1 : 0.94, opacity: k === i ? 1 : 0.55 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} onClick={() => { setDir(k > i ? 1 : -1); setI(k); }} className={cn("rounded-2xl", k === i && "shadow-glow")}>
                <ReelCard src={x.video} caption={x.name} credit={x.occasion} showControls={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
