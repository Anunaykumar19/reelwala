"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Star, Zap, Clock, MapPin, MessageCircle, Camera, Check, ChevronUp, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import ReelCard from "@/components/reels/ReelCard";
import MagneticButton from "@/components/ui/MagneticButton";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { PACKAGES } from "@/lib/data/packages";
import { cn, inr, waLink } from "@/lib/utils";
import { useUI } from "@/store/ui";
import { format } from "date-fns";

export default function ProfileView({ r }: { r: any }) {
  const openViewer = useUI((s) => s.openViewer);
  const [pkg, setPkg] = useState<string>("party");
  const [date, setDate] = useState("");
  const [sheet, setSheet] = useState(false);
  const [filter, setFilter] = useState<number | null>(null);
  const price = (k: string) => r.packages.find((p: any) => p.key === k)?.price ?? PACKAGES.find((p) => p.id === k)!.price;
  const reviews = filter ? r.reviewList.filter((x: any) => x.rating === filter) : r.reviewList;
  const bookHref = `/book?reeler=${r.slug}&package=${pkg}${date ? `&date=${date}` : ""}&city=${encodeURIComponent(r.city)}`;
  const share = () => {
    if (navigator.share) { navigator.share({ title: r.name, url: location.href }).catch(() => {}); return; }
    navigator.clipboard?.writeText(location.href); toast.success("Link copied");
  };

  const BookingCard = (
    <div className="glass gradient-border rounded-3xl p-5">
      <div className="flex items-baseline justify-between"><p className="text-sm text-muted">From</p><p className="font-display text-3xl font-bold">{inr(price(pkg))}</p></div>
      <div className="mt-4 space-y-2">
        {PACKAGES.map((p) => (
          <button key={p.id} onClick={() => setPkg(p.id)} className={cn("w-full flex items-center justify-between rounded-2xl px-4 py-3 border text-left transition-all", pkg === p.id ? "bg-pink/10 border-pink/50" : "border-fg/10 hover:border-fg/30")}>
            <div><p className="text-sm font-semibold">{p.name}</p><p className="text-[11px] text-muted">{p.hours} hr · {p.reels}{p.id === "event" ? "+" : ""} reels</p></div>
            <div className="flex items-center gap-2"><span className="font-display font-semibold">{inr(price(p.id))}</span>{pkg === p.id && <Check size={14} className="text-pink" />}</div>
          </button>
        ))}
      </div>
      <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="mt-4 h-11 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50" />
      {date && r.blocked.includes(date) && <p className="mt-2 text-xs text-orange">Booked on this date. Pick another, or let us assign a similar reeler.</p>}
      <MagneticButton href={bookHref} className="mt-4 w-full" glow disabled={!!date && r.blocked.includes(date)}>Book {r.name.split(" ")[0]} →</MagneticButton>
      <a href={waLink(`Hi! I want to book ${r.name} (${r.slug}) for a shoot.`)} target="_blank" rel="noreferrer" className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full glass text-sm font-semibold"><MessageCircle size={15} className="text-[#25D366]" /> Chat on WhatsApp</a>
      <p className="mt-3 text-center text-[11px] text-muted">Pay 30% token · Free cancellation 24 hrs before</p>
    </div>
  );

  return (
    <div className="container pb-32 lg:pb-24">
      {/* header */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:items-end">
        <div className="relative mx-auto w-full max-w-[320px] lg:max-w-none">
          <div className="aspect-reel lg:aspect-[4/5] overflow-hidden rounded-[2rem] shadow-glow">
            <ReelCard src={r.coverReel || r.reels[0]} autoplay="always" showControls={false} rounded="rounded-[2rem]" className="h-full" onClick={() => openViewer(r.reels.map((s: string) => ({ src: s, reelerSlug: r.slug, reelerName: r.name })), 0)} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.avatar} alt={r.name} className="absolute -bottom-6 left-6 h-20 w-20 rounded-full object-cover ring-4 ring-bg shadow-card" />
        </div>
        <div className="pt-6 lg:pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="cyan"><BadgeCheck size={12} /> Verified Reeler</Pill>
            <Pill><Clock size={12} /> Delivers in 24 hrs</Pill>
            <Pill><Zap size={12} className="text-orange" /> Replies {r.responseTime}</Pill>
          </div>
          <h1 className="mt-4 font-display text-h1 font-bold">{r.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1 text-fg font-semibold"><Star size={14} className="fill-orange text-orange" /> {r.rating} <span className="text-muted font-normal">({r.reviews} reviews)</span></span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {r.area}, {r.city}</span>
            <span className="flex items-center gap-1"><Camera size={14} /> {r.delivered} reels delivered</span>
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed">{r.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">{r.tags.map((t: string) => <Pill key={t}>{t}</Pill>)}{r.styles.map((s: string) => <Pill key={s} tone="brand" className="capitalize">{s}</Pill>)}</div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted">
            <span>📱 {r.equipment}</span><span>📷 {r.instagram}</span>
            <button onClick={share} className="flex items-center gap-1 hover:text-fg"><Share2 size={12} /> Share</button>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-14">
          <Reveal>
            <h2 className="font-display text-h3 font-semibold">Portfolio</h2>
            <p className="text-sm text-muted mt-1">Tap any reel to open the viewer. Swipe up for more.</p>
            <div className="mt-5 columns-2 gap-3 sm:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
              {r.reels.map((s: string, i: number) => <ReelCard key={s + i} src={s} caption={r.tags[i % r.tags.length]} credit={r.instagram} className={i % 3 === 1 ? "mt-6" : ""} onClick={() => openViewer(r.reels.map((x: string) => ({ src: x, reelerSlug: r.slug, reelerName: r.name })), i)} />)}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-h3 font-semibold">Packages</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {PACKAGES.map((p) => (
                <div key={p.id} className={cn("rounded-3xl p-5 border", p.popular ? "glass gradient-border" : "glass border-fg/10")}>
                  <p className="font-display text-lg font-semibold">{p.name}</p>
                  <p className="font-display text-3xl font-bold mt-2">{inr(price(p.id))}</p>
                  <p className="text-xs text-muted">{p.hours} hr · {p.reels}{p.id === "event" ? "+" : ""} reels</p>
                  <ul className="mt-3 space-y-1 text-xs text-muted">{p.features.slice(0, 4).map((f) => <li key={f}>· {f}</li>)}</ul>
                  <button onClick={() => { setPkg(p.id); setSheet(true); }} className="mt-4 text-sm font-semibold text-pink">Select →</button>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-h3 font-semibold">Availability</h2>
            <p className="text-sm text-muted mt-1">Pick a free date, it carries into your booking.</p>
            <div className="mt-5 max-w-md"><AvailabilityCalendar blocked={r.blocked} value={date} onChange={(d) => { setDate(d); toast.success(`${format(new Date(d + "T00:00"), "d MMM")} selected`); }} /></div>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="font-display text-h3 font-semibold">Reviews</h2><p className="text-sm text-muted mt-1">All from verified bookings.</p></div>
              <div className="flex gap-1.5">{[null, 5, 4].map((f) => <button key={String(f)} onClick={() => setFilter(f)} className={cn("rounded-full px-3 py-1.5 text-xs border", filter === f ? "bg-brand text-white border-transparent" : "border-fg/15")}>{f ? `${f}★` : "All"}</button>)}</div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <AnimatePresence>
                {reviews.map((x: any) => (
                  <motion.div key={x.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-3xl p-5 border border-fg/10">
                    <div className="flex items-center justify-between"><p className="font-semibold text-sm flex items-center gap-1.5">{x.name} <BadgeCheck size={13} className="text-cyan" /></p><span className="flex gap-0.5">{Array.from({ length: x.rating }).map((_, k) => <Star key={k} size={12} className="fill-orange text-orange" />)}</span></div>
                    <p className="text-[11px] text-muted mt-0.5">{x.occasion} · {format(new Date(x.at), "MMM yyyy")} · Verified booking</p>
                    <p className="mt-3 text-sm leading-relaxed">{x.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
        <aside className="hidden lg:block"><div className="sticky top-28">{BookingCard}</div></aside>
      </div>

      {/* mobile bottom bar + sheet */}
      <div className="fixed inset-x-3 bottom-3 z-[90] lg:hidden">
        <button onClick={() => setSheet(true)} className="glass w-full rounded-full p-1.5 pl-5 flex items-center justify-between shadow-card">
          <span className="text-sm"><span className="text-muted">From </span><span className="font-display text-lg font-bold">{inr(price(pkg))}</span></span>
          <span className="h-12 rounded-full bg-brand px-6 text-white font-semibold text-sm flex items-center gap-2">Book now <ChevronUp size={14} /></span>
        </button>
      </div>
      <AnimatePresence>
        {sheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSheet(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 rounded-t-4xl bg-surface p-4 pb-safe" data-lenis-prevent>
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-fg/20" />
              {BookingCard}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Link href="/reelers" className="sr-only">All reelers</Link>
    </div>
  );
}
