"use client";
import { Check, Sparkles, ArrowRight, Scissors } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import { PACKAGES, EDIT_PRICING } from "@/lib/data/packages";
import { inr, cn } from "@/lib/utils";

export default function PricingTeaser() {
  return (
    <section id="pricing" className="relative py-20 md:py-28">
      <div className="blob -left-40 bottom-0 h-[460px] w-[460px] bg-pink/50" />
      <div className="container">
        <SectionHeading align="center" eyebrow="Pricing" title="Transparent prices." highlight="No surprise bills." sub="A traditional videographer charges ₹8,000–25,000 and takes weeks. Reelwala starts at ₹999 and delivers tomorrow." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <TiltCard className="h-full rounded-4xl">
                <div className={cn("relative h-full rounded-4xl p-7 flex flex-col glass", p.popular ? "gradient-border shadow-glow" : "border border-fg/10")}>
                  {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-glow-sm flex items-center gap-1"><Sparkles size={11} /> Most booked</span>}
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{p.name}</p>
                  <p className="text-sm text-muted mt-1">{p.tagline}</p>
                  <p className="mt-5 font-display text-5xl font-bold">{inr(p.price)}<span className="text-base font-medium text-muted">{p.id === "event" ? "+" : ""}</span></p>
                  <p className="text-sm text-muted mt-1">{p.hours} hr{p.hours > 1 ? "s" : ""} shoot · {p.reels}{p.id === "event" ? "+" : ""} reels</p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map((f) => <li key={f} className="flex items-start gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-cyan/20 text-cyan flex items-center justify-center shrink-0"><Check size={10} strokeWidth={3} /></span>{f}</li>)}
                  </ul>
                  <div className="mt-auto pt-7">
                    <MagneticButton href={`/book?package=${p.id}`} variant={p.popular ? "primary" : "glass"} className="w-full" glow={p.popular}>Book {p.name} <ArrowRight size={16} /></MagneticButton>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3} className="mt-5">
          <div className="glass rounded-4xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 border border-fg/10">
            <span className="h-14 w-14 rounded-2xl bg-brand flex items-center justify-center text-white shadow-glow-sm shrink-0"><Scissors size={24} /></span>
            <div className="flex-1">
              <p className="font-display text-xl font-semibold">Footage hai? Edit hum kar denge. <span className="text-gradient">{inr(EDIT_PRICING.perReel)}/reel.</span></p>
              <p className="text-sm text-muted mt-1">Upload phone clips, pick a style (Trending, Cinematic, Wedding, Meme…), get an edited reel in 24 hrs. Express 6-hr for {inr(EDIT_PRICING.expressPerReel)}.</p>
            </div>
            <MagneticButton href="/edit" variant="white">Edit my clips</MagneticButton>
          </div>
        </Reveal>
        <p className="mt-6 text-center text-xs text-muted">All prices include GST. Add-ons: extra reel ₹299 · raw footage ₹499 · same-day ₹699 · drone ₹1,999. <a href="/pricing" className="underline hover:text-fg">Full pricing →</a></p>
      </div>
    </section>
  );
}
