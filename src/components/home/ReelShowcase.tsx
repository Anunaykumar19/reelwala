"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReelCard from "@/components/reels/ReelCard";
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";
import { SHOWCASE } from "@/lib/data/content";
import { REELERS } from "@/lib/data/reelers";
import { useUI } from "@/store/ui";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ReelShowcase() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const openViewer = useUI((s) => s.openViewer);
  const reduced = usePrefersReducedMotion();
  const all = SHOWCASE.flatMap((g) => g.items.map((src, i) => ({ src, occasion: g.occasion, reeler: REELERS[(g.occasion.length + i) % REELERS.length] })));

  useEffect(() => {
    if (!wrap.current || !track.current || reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const dist = () => track.current!.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: wrap.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <section className="relative overflow-hidden">
      <div ref={wrap} className="lg:h-[100svh] flex flex-col justify-center py-20 lg:py-0">
        <div className="container mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Reel wall</p>
            <h2 className="mt-3 font-display text-h2 font-semibold">Made by Reelers. <GradientText>Loved by feeds.</GradientText></h2>
          </div>
          <p className="text-sm text-muted max-w-sm">Scroll sideways. Tap any reel to open the vertical viewer. Double-tap to like, obviously.</p>
        </div>
        <div ref={track} className="flex gap-4 px-4 lg:px-10 w-max overflow-x-auto lg:overflow-visible no-scrollbar snap-x lg:snap-none max-w-[100vw] lg:max-w-none" data-lenis-prevent>
          {SHOWCASE.map((g, gi) => (
            <div key={g.occasion} className="flex shrink-0 gap-4 snap-start">
              <div className="w-[140px] md:w-[180px] flex flex-col justify-end pb-6 pr-2">
                <span className="font-display text-4xl md:text-6xl font-bold text-fg/10 leading-none">0{gi + 1}</span>
                <span className="font-display text-xl md:text-2xl font-semibold mt-2">{g.occasion}</span>
                <span className="text-xs text-muted mt-1">{g.items.length} reels</span>
              </div>
              {g.items.map((src, i) => {
                const idx = all.findIndex((a) => a.src === src && a.occasion === g.occasion);
                const r = all[idx].reeler;
                return (
                  <div key={src + i} className={`w-[200px] md:w-[240px] shrink-0 ${i % 2 ? "mt-8" : ""}`}>
                    <ReelCard src={src} credit={`@${r.slug.replace(/-/g, ".")}`} caption={g.occasion} onClick={() => openViewer(all.map((a) => ({ src: a.src, reelerSlug: a.reeler.slug, reelerName: a.reeler.name, caption: `${a.occasion} reel` })), idx)} />
                  </div>
                );
              })}
            </div>
          ))}
          <div className="w-[260px] md:w-[320px] shrink-0 flex items-center">
            <div className="glass gradient-border rounded-3xl p-8 text-center">
              <p className="font-display text-2xl font-semibold">Aapki reel yahan ho sakti hai.</p>
              <MagneticButton href="/book" className="mt-5" glow>Book a Reeler <ArrowRight size={16} /></MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
