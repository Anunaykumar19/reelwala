"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, Map as MapIcon, LayoutGrid, X, Star, ChevronDown } from "lucide-react";
import ReelerCard from "@/components/reels/ReelerCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { CITIES } from "@/lib/data/cities";
import { OCCASIONS } from "@/lib/data/occasions";
import type { ReelerDTO } from "@/lib/reelers-query";
import { cn, inr } from "@/lib/utils";
import { useUI } from "@/store/ui";

const ReelerMap = dynamic(() => import("./ReelerMap"), { ssr: false, loading: () => <div className="h-full w-full skeleton rounded-3xl" /> });
const STYLES = ["cinematic", "trendy", "aesthetic", "fast-cut", "wedding", "urban"];
const SORTS = [["recommended", "Recommended"], ["price", "Price: low to high"], ["rating", "Top rated"], ["nearest", "Nearest"]] as const;

export default function BrowseView({ reelers, initialCity, initialOccasion }: { reelers: ReelerDTO[]; initialCity?: string; initialOccasion?: string }) {
  const globalCity = useUI((s) => s.city);
  const [city, setCity] = useState(initialCity || globalCity || "Delhi NCR");
  const [occasion, setOccasion] = useState(initialOccasion || "");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [date, setDate] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("recommended");
  const [map, setMap] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<[number, number] | null>(null);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  useEffect(() => { if (sort === "nearest" && !me) navigator.geolocation?.getCurrentPosition((p) => setMe([p.coords.latitude, p.coords.longitude])); }, [sort, me]);

  const cityMeta = CITIES.find((c) => c.name === city) || CITIES[0];
  const list = useMemo(() => {
    let l = reelers.filter((r) => r.city === city);
    if (occasion) l = l.filter((r) => r.tags.some((t) => t.toLowerCase().includes(occasion.toLowerCase().split(" ")[0])));
    l = l.filter((r) => r.startingPrice <= maxPrice && r.rating >= minRating);
    if (date) l = l.filter((r) => !r.blocked.includes(date));
    if (styles.length) l = l.filter((r) => styles.every((s) => r.styles.includes(s)));
    const dist = (r: ReelerDTO) => me && r.lat && r.lng ? Math.hypot(r.lat - me[0], r.lng - me[1]) : 999;
    if (sort === "price") l.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === "rating") l.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === "nearest") l.sort((a, b) => dist(a) - dist(b));
    if (sort === "recommended") l.sort((a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1));
    return l;
  }, [reelers, city, occasion, maxPrice, minRating, date, styles, sort, me]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">City</p>
        <div className="mt-2 flex flex-wrap gap-2">{CITIES.filter((c) => c.live).map((c) => <button key={c.slug} onClick={() => setCity(c.name)} className={cn("rounded-full px-3 py-1.5 text-sm border transition-all", city === c.name ? "bg-brand text-white border-transparent" : "border-fg/15 hover:border-fg/40")}>{c.name}</button>)}</div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Occasion</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={() => setOccasion("")} className={cn("rounded-full px-3 py-1.5 text-sm border", !occasion ? "bg-brand text-white border-transparent" : "border-fg/15")}>Any</button>
          {OCCASIONS.slice(0, 9).map((o) => <button key={o.slug} onClick={() => setOccasion(o.name)} className={cn("rounded-full px-3 py-1.5 text-sm border transition-all", occasion === o.name ? "bg-brand text-white border-transparent" : "border-fg/15 hover:border-fg/40")}>{o.emoji} {o.name}</button>)}
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted"><span>Starting price</span><span className="text-fg">≤ {inr(maxPrice)}</span></div>
        <input type="range" min={999} max={2500} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-3 w-full accent-pink" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Min rating</p>
        <div className="mt-2 flex gap-2">{[0, 4.5, 4.8, 5].map((r) => <button key={r} onClick={() => setMinRating(r)} className={cn("rounded-full px-3 py-1.5 text-sm border flex items-center gap-1", minRating === r ? "bg-brand text-white border-transparent" : "border-fg/15")}><Star size={12} className="fill-current" />{r ? r + "+" : "Any"}</button>)}</div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Available on</p>
        <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="mt-2 h-11 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Style</p>
        <div className="mt-2 flex flex-wrap gap-2">{STYLES.map((s) => <button key={s} onClick={() => setStyles((x) => x.includes(s) ? x.filter((y) => y !== s) : [...x, s])} className={cn("rounded-full px-3 py-1.5 text-sm border capitalize transition-all", styles.includes(s) ? "bg-cyan/20 text-cyan border-cyan/40" : "border-fg/15 hover:border-fg/40")}>{s}</button>)}</div>
      </div>
      <button onClick={() => { setOccasion(""); setMaxPrice(2500); setMinRating(0); setDate(""); setStyles([]); }} className="text-sm text-muted hover:text-fg underline">Reset filters</button>
    </div>
  );

  return (
    <div className="container pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Browse</p>
          <h1 className="mt-2 font-display text-h1 font-bold">Reelers in <span className="text-gradient">{city}</span></h1>
          <p className="mt-2 text-muted">{list.length} verified reeler{list.length !== 1 ? "s" : ""}{occasion ? ` for ${occasion}` : ""}{date ? ` free on ${date}` : ""}.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-11 appearance-none rounded-full glass pl-4 pr-9 text-sm font-medium outline-none">{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <button onClick={() => setMap((m) => !m)} className={cn("h-11 rounded-full px-4 text-sm font-medium flex items-center gap-2", map ? "bg-brand text-white" : "glass")}>{map ? <LayoutGrid size={16} /> : <MapIcon size={16} />}{map ? "Grid" : "Map"}</button>
          <button onClick={() => setDrawer(true)} className="h-11 rounded-full glass px-4 text-sm font-medium flex items-center gap-2 lg:hidden"><SlidersHorizontal size={16} /> Filters</button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block"><div className="glass rounded-3xl p-5 border border-fg/10 sticky top-28">{Filters}</div></aside>
        <div>
          {map ? (
            <div className="h-[70vh] rounded-3xl overflow-hidden border border-fg/10"><ReelerMap reelers={list} center={[cityMeta.lat, cityMeta.lng]} /></div>
          ) : loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[380px] rounded-3xl skeleton" />)}</div>
          ) : list.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center border border-fg/10"><p className="font-display text-2xl font-semibold">Koi match nahi mila 😅</p><p className="mt-2 text-muted">Loosen a filter, or let us assign the best reeler for you.</p><MagneticButton href="/book" className="mt-5">Let Reelwala assign</MagneticButton></div>
          ) : (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((r, i) => <motion.div key={r.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}><ReelerCard r={r as any} className="h-full" /></motion.div>)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setDrawer(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-4xl bg-surface p-6 pb-safe" data-lenis-prevent>
              <div className="flex items-center justify-between mb-5"><h3 className="font-display text-xl font-semibold">Filters</h3><button onClick={() => setDrawer(false)} className="h-9 w-9 rounded-full glass flex items-center justify-center"><X size={16} /></button></div>
              {Filters}
              <MagneticButton onClick={() => setDrawer(false)} className="mt-6 w-full">Show {list.length} reelers</MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
