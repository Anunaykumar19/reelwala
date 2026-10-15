"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Check, Copy, MessageCircle, CalendarDays, MapPin, Clock, Wand2, Sparkles, Film, PackageCheck } from "lucide-react";
import toast from "react-hot-toast";
import MagneticButton from "@/components/ui/MagneticButton";
import { inr, waLink } from "@/lib/utils";
import { format } from "date-fns";

const TIMELINE = [
  { k: "BOOKED", t: "Booked", d: "Token received", icon: Check },
  { k: "ASSIGNED", t: "Reeler assigned", d: "Within 15 min", icon: Sparkles },
  { k: "SHOOT_DONE", t: "Shoot done", d: "On the day", icon: Film },
  { k: "EDITING", t: "Editing", d: "Trending audio, cuts", icon: Wand2 },
  { k: "DELIVERED", t: "Delivered", d: "Within 24 hrs", icon: PackageCheck },
];
const ORDER = ["PENDING_PAYMENT", "BOOKED", "ASSIGNED", "SHOOT_DONE", "EDITING", "DELIVERED"];

export default function SuccessView({ booking }: { booking: any }) {
  useEffect(() => {
    const end = Date.now() + 1200;
    const f = () => { confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: ["#7C3AED", "#EC4899", "#F97316", "#22D3EE"] }); confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: ["#7C3AED", "#EC4899", "#F97316", "#22D3EE"] }); if (Date.now() < end) requestAnimationFrame(f); };
    f();
  }, []);
  const idx = Math.max(1, ORDER.indexOf(booking.status));
  const msg = `Hi Reelwala! Booking ${booking.code} confirmed for ${booking.occasion} on ${format(new Date(booking.date), "d MMM")} at ${booking.startTime}. Please share reeler details.`;

  return (
    <div className="container pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="mx-auto h-24 w-24 rounded-full bg-brand flex items-center justify-center shadow-glow"><Check size={44} className="text-white" strokeWidth={3} /></motion.div>
        <h1 className="mt-6 font-display text-h1 font-bold">Booking <span className="text-gradient">pakki!</span> 🎉</h1>
        <p className="mt-3 text-muted">Reeler aayega, shoot karega, 24 ghante me reel aa jaayegi.</p>
        <button onClick={() => { navigator.clipboard?.writeText(booking.code); toast.success("Copied"); }} className="mt-5 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 font-display text-xl font-semibold tracking-wider">{booking.code} <Copy size={14} className="text-muted" /></button>
      </div>

      <div className="mx-auto mt-12 max-w-3xl grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="glass gradient-border rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Shoot details</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><CalendarDays size={16} className="text-pink shrink-0 mt-0.5" /><span>{format(new Date(booking.date), "EEEE, d MMMM yyyy")} · {booking.startTime} · {booking.durationHrs} hr</span></li>
            <li className="flex gap-3"><MapPin size={16} className="text-pink shrink-0 mt-0.5" /><span>{booking.address}, {booking.city}</span></li>
            <li className="flex gap-3"><Clock size={16} className="text-pink shrink-0 mt-0.5" /><span>{booking.occasion} · {booking.packageKey} package</span></li>
          </ul>
          <div className="mt-5 border-t border-fg/10 pt-4 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted">Total</span><span className="font-semibold">{inr(booking.total)}</span></div>
            <div className="flex justify-between text-cyan"><span>Paid</span><span>{inr(booking.amountPaid)}</span></div>
            {booking.amountDue > 0 && <div className="flex justify-between text-muted"><span>Due after shoot</span><span>{inr(booking.amountDue)}</span></div>}
          </div>
          {booking.reeler ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-fg/5 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={booking.reeler.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-pink/50" />
              <div><p className="font-semibold">{booking.reeler.name}</p><p className="text-xs text-muted">{booking.reeler.area} · replies {booking.reeler.responseTime}</p></div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-cyan/10 border border-cyan/30 p-3 text-sm"><p className="font-semibold text-cyan flex items-center gap-2"><Wand2 size={14} /> Assigning your reeler</p><p className="text-xs text-muted mt-1">We&apos;ll WhatsApp you the reeler&apos;s profile within 15 minutes.</p></div>
          )}
        </div>

        <div className="glass rounded-3xl p-6 border border-fg/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Timeline</p>
          <ol className="mt-4 relative">
            <span className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-fg/10" />
            {TIMELINE.map((s, i) => { const done = i < idx; const cur = i === idx; return (
              <motion.li key={s.k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="relative flex gap-4 py-2.5">
                <span className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-brand text-white" : cur ? "bg-bg border-2 border-cyan text-cyan shadow-glow-sm" : "bg-surface-2 text-muted"}`}><s.icon size={14} /></span>
                <div><p className={`text-sm font-semibold ${done || cur ? "" : "text-muted"}`}>{s.t}</p><p className="text-xs text-muted">{s.d}</p></div>
              </motion.li>); })}
          </ol>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
        <MagneticButton href={waLink(msg)} glow><MessageCircle size={16} /> Confirm on WhatsApp</MagneticButton>
        <MagneticButton href="/dashboard" variant="glass">Track in dashboard</MagneticButton>
        <MagneticButton href="/" variant="ghost">Back home</MagneticButton>
      </div>
    </div>
  );
}
