"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Sparkles, Clock, Upload, ArrowRight, Check, BadgeCheck, Star } from "lucide-react";
import Link from "next/link";
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";
import { OCCASIONS } from "@/lib/data/occasions";
import { REELERS } from "@/lib/data/reelers";
import { VIDEOS } from "@/lib/data/videos";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", icon: CalendarDays, title: "Choose occasion & date", hinglish: "Kya hai, kab hai", desc: "Birthday, shaadi, café launch — pick the vibe, pick the day, drop a location pin." },
  { n: "02", icon: Sparkles, title: "Pick a reeler or let us assign", hinglish: "Apna reeler chuno", desc: "Browse verified profiles with real reels, or toggle 'assign the best' and we match you in minutes." },
  { n: "03", icon: Clock, title: "Edited reels in 24 hrs", hinglish: "24 ghante me reel", desc: "Reeler shoots, edits with trending audio, and delivers to your dashboard & WhatsApp. One free revision." },
];

function Illustration({ step }: { step: number }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px] md:max-w-[420px]">
      <div className="absolute inset-0 rounded-[2.5rem] glass gradient-border overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="absolute inset-0 p-6 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-muted">Step 1 · Occasion</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {OCCASIONS.slice(0, 9).map((o, i) => (
                  <motion.div key={o.slug} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }} className={cn("rounded-2xl p-3 text-center text-xs border", i === 1 ? "bg-brand text-white border-transparent shadow-glow-sm" : "border-fg/10 bg-fg/5")}>
                    <span className="block text-2xl">{o.emoji}</span><span className="block mt-1 font-medium truncate">{o.name}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-auto rounded-2xl bg-fg/5 border border-fg/10 p-3 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><CalendarDays size={16} className="text-pink" /> Sat, 24 Oct · 6 PM</span><span className="text-cyan text-xs font-semibold">8 reelers free</span>
              </motion.div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="absolute inset-0 p-6 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-muted">Step 2 · Pick a reeler</p>
              {REELERS.slice(0, 3).map((x, i) => (
                <motion.div key={x.slug} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }} className={cn("mt-3 flex items-center gap-3 rounded-2xl p-3 border", i === 0 ? "border-pink/60 bg-pink/10" : "border-fg/10 bg-fg/5")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold flex items-center gap-1 truncate">{x.name} <BadgeCheck size={13} className="text-cyan" /></p><p className="text-[11px] text-muted">{x.area} · <Star size={10} className="inline fill-orange text-orange" /> {x.rating}</p></div>
                  <span className="text-sm font-semibold">₹{x.startingPrice}</span>
                  {i === 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }} className="h-6 w-6 rounded-full bg-brand flex items-center justify-center"><Check size={12} className="text-white" /></motion.span>}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-auto rounded-2xl glass p-3 flex items-center justify-between text-sm">
                <span>Or let Reelwala assign</span><span className="h-6 w-11 rounded-full bg-brand p-0.5"><motion.span initial={{ x: 0 }} animate={{ x: 20 }} transition={{ delay: 0.9, type: "spring" }} className="block h-5 w-5 rounded-full bg-white" /></span>
              </motion.div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="absolute inset-0 p-6 flex flex-col items-center">
              <p className="self-start text-xs uppercase tracking-widest text-muted">Step 3 · Delivered</p>
              <motion.div initial={{ rotate: -8, y: 40, opacity: 0 }} animate={{ rotate: -4, y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }} className="mt-4 w-[55%] aspect-reel rounded-[1.6rem] bg-black p-1 shadow-glow">
                <video src={VIDEOS.party[1]} muted loop autoPlay playsInline className="h-full w-full rounded-[1.4rem] object-cover" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: "spring" }} className="mt-4 rounded-full bg-cyan/15 border border-cyan/40 px-4 py-1.5 text-xs font-semibold text-cyan flex items-center gap-2"><Clock size={12} /> Delivered in 19h 42m</motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-3 text-xs text-muted">Sent to dashboard + WhatsApp ✓</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand opacity-20 blur-3xl" />
    </div>
  );
}

export default function HowItWorks() {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!wrap.current || reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: wrap.current, start: "top top", end: "+=220%", pin: true, scrub: true,
        onUpdate: (self) => { setProgress(self.progress); setStep(Math.min(2, Math.floor(self.progress * 3))); },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <section className="relative">
      <div ref={wrap} className="relative min-h-[100svh] flex items-center py-20 lg:py-0">
        <div className="blob top-1/4 right-0 h-[400px] w-[400px] bg-orange/50" />
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">How it works</p>
            <h2 className="mt-3 font-display text-h2 font-semibold">Teen steps, <GradientText>ek reel.</GradientText></h2>
            <div className="mt-10 space-y-2">
              {STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <button key={s.n} onClick={() => setStep(i)} className={cn("w-full text-left rounded-3xl p-5 transition-all duration-500 border", active ? "glass border-fg/15 shadow-card" : "border-transparent opacity-60 hover:opacity-100")}>
                    <div className="flex items-start gap-4">
                      <span className={cn("h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center transition-colors", active ? "bg-brand text-white shadow-glow-sm" : "bg-fg/8 text-muted")}><s.icon size={20} /></span>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-muted">{s.n} · {s.hinglish}</p>
                        <h3 className="font-display text-xl font-semibold mt-0.5">{s.title}</h3>
                        <AnimatePresence initial={false}>{active && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-sm text-muted mt-2 overflow-hidden">{s.desc}</motion.p>}</AnimatePresence>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 hidden lg:block h-1 w-full rounded-full bg-fg/10 overflow-hidden"><div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${progress * 100}%` }} /></div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton href="/book">Start booking <ArrowRight size={16} /></MagneticButton>
              <Link href="/edit" className="flex items-center gap-2 text-sm text-muted hover:text-fg group"><Upload size={14} /> Already have footage? Just get it edited <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>
            </div>
          </div>
          <Illustration step={step} />
        </div>
      </div>
    </section>
  );
}
