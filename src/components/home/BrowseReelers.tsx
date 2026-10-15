"use client";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, LocateFixed, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import SectionHeading from "@/components/ui/SectionHeading";
import ReelerCard from "@/components/reels/ReelerCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { REELERS } from "@/lib/data/reelers";
import { CITIES, LIVE_CITIES } from "@/lib/data/cities";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

export default function BrowseReelers() {
  const city = useUI((s) => s.city);
  const setCity = useUI((s) => s.setCity);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const list = useMemo(() => REELERS.filter((r) => r.city === city), [city]);

  const locate = () => {
    if (!navigator.geolocation) return toast.error("Location not supported on this device");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = [...CITIES].sort((a, b) => Math.hypot(a.lat - coords.latitude, a.lng - coords.longitude) - Math.hypot(b.lat - coords.latitude, b.lng - coords.longitude))[0];
        setLocating(false);
        if (nearest.live) { setCity(nearest.name); toast.success(`${nearest.name} detected 📍`); }
        else toast(`${nearest.name} me jald aa rahe hain! Showing Delhi NCR for now.`, { icon: "🚀" });
      },
      () => { setLocating(false); toast.error("Location permission nahi mili. Pick a city manually."); },
      { timeout: 8000 },
    );
  };
  const scrollBy = (d: number) => track.current?.scrollBy({ left: d * 360, behavior: "smooth" });

  return (
    <section id="browse" className="relative py-20 md:py-28">
      <div className="blob top-20 -left-40 h-[400px] w-[400px] bg-purple/60" />
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Near you" title="Browse Reelers" highlight="near you" sub="Verified creators, real reviews, prices upfront. Tap a reel to watch, tap a card to book." />
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setOpen((o) => !o)} className="flex h-12 items-center gap-2 rounded-full glass px-4 text-sm font-medium">
                <MapPin size={16} className="text-pink" /> {city} <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.ul initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl bg-surface border border-fg/10 shadow-card p-1.5">
                    {CITIES.map((c) => (
                      <li key={c.slug}>
                        <button disabled={!c.live} onClick={() => { setCity(c.name); setOpen(false); }} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-fg/5 disabled:opacity-40", c.name === city && "bg-fg/5 font-semibold")}>
                          {c.name}{!c.live && <span className="text-[10px] uppercase text-orange">soon</span>}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <button onClick={locate} aria-label="Detect location" className="h-12 w-12 rounded-full glass flex items-center justify-center hover:bg-fg/10">
              <LocateFixed size={18} className={cn(locating && "animate-spin text-cyan")} />
            </button>
          </div>
        </div>

        <div className="relative mt-10">
          <div ref={track} className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0" data-lenis-prevent>
            <AnimatePresence mode="popLayout">
              {list.map((r, i) => (
                <motion.div key={r.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.06, duration: 0.5 }} className="w-[300px] md:w-[340px] shrink-0 snap-start">
                  <ReelerCard r={r} className="h-full" />
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="w-[260px] shrink-0 snap-start">
              <div className="glass rounded-3xl h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 gradient-border">
                <p className="font-display text-2xl font-semibold">{LIVE_CITIES.length * 40}+ more</p>
                <p className="text-muted text-sm mt-1">reelers across cities</p>
                <MagneticButton href="/reelers" size="sm" className="mt-5">See all <ArrowRight size={14} /></MagneticButton>
              </div>
            </div>
          </div>
          <div className="hidden md:flex absolute -top-14 right-0 gap-2">
            <button onClick={() => scrollBy(-1)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-fg/10"><ChevronLeft size={18} /></button>
            <button onClick={() => scrollBy(1)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-fg/10"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
