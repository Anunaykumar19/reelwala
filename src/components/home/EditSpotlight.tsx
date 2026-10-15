"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Wand2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import { VIDEOS } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

export function BeforeAfter({ before, after, className }: { before: string; after: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const update = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      data-cursor="Drag"
      className={cn("relative aspect-reel w-full select-none overflow-hidden rounded-[2rem] bg-black shadow-card touch-none", className)}
      onPointerDown={(e) => { setDrag(true); update(e.clientX); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => drag && update(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onPointerLeave={() => setDrag(false)}
    >
      <video src={after} muted loop autoPlay playsInline crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 p-4 pt-20 bg-gradient-to-t from-black/70 to-transparent">
        <p className="font-display text-xl font-bold text-white drop-shadow">birthday but make it ✨cinematic✨</p>
        <p className="text-xs text-white/80 mt-1">♫ trending audio · 1.2M uses</p>
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <video src={before} muted loop autoPlay playsInline crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover [filter:grayscale(.6)_contrast(.85)_brightness(.8)_blur(.4px)]" />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">RAW</span>
      </div>
      <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">EDITED</span>
      <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <motion.div animate={{ scale: drag ? 1.15 : 1 }} className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg flex items-center justify-center text-black text-xs font-bold">⇔</motion.div>
      </div>
    </div>
  );
}

export default function EditSpotlight() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="blob right-0 top-10 h-[420px] w-[420px] bg-cyan/40" />
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1 mx-auto w-full max-w-[340px]">
          <Reveal><BeforeAfter before={VIDEOS.kids[0]} after={VIDEOS.kids[0]} /></Reveal>
          <p className="mt-3 text-center text-xs text-muted">Drag the handle. Same clip, Reelwala edit.</p>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading eyebrow="Edit-only service" title="Footage hai?" highlight="Edit hum kar denge." sub="Phone clips, GoPro, whatever. Upload, pick a style and music vibe, and get a scroll-stopping reel from ₹199. Express 6-hour delivery available." />
          <Reveal delay={0.15} className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            {[["Trending", "Fast cuts, viral audio"], ["Cinematic", "Slow-mo, colour grade"], ["Wedding", "Emotional, warm"], ["Meme / Funny", "Captions, zooms, SFX"]].map(([t, d]) => (
              <div key={t} className="glass rounded-2xl p-4 border border-fg/10"><p className="font-semibold text-sm flex items-center gap-2"><Wand2 size={14} className="text-pink" />{t}</p><p className="text-xs text-muted mt-1">{d}</p></div>
            ))}
          </Reveal>
          <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href="/edit" glow><Upload size={16} /> Upload & get a quote</MagneticButton>
            <MagneticButton href="/pricing#edit" variant="ghost">See edit pricing <ArrowRight size={14} /></MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
