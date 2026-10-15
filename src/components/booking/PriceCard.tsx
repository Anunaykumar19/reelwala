"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/store/booking";
import { computePrice } from "@/lib/pricing";
import { inr } from "@/lib/utils";
import CountUp from "@/components/ui/CountUp";
import { format } from "date-fns";

export default function PriceCard({ packagePrice }: { packagePrice?: number }) {
  const b = useBooking();
  const p = computePrice({ packageKey: b.packageKey, packagePrice, addons: b.addons, extraReels: b.extraReels, coupon: b.coupon, paymentMode: b.paymentMode });
  const rows = [[`${p.pkg.name} package`, p.base], ...p.addonLines.map((a) => [`${a.name}${a.qty > 1 ? ` × ${a.qty}` : ""}`, a.price * a.qty] as [string, number])] as [string, number][];
  return (
    <div className="glass gradient-border rounded-3xl p-5 sticky top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Your booking</p>
      <div className="mt-3 space-y-1 text-sm">
        {b.occasion && <p className="font-display text-lg font-semibold">{b.occasion}</p>}
        {b.date && <p className="text-muted">{format(new Date(b.date + "T00:00"), "EEE, d MMM")} · {b.startTime} · {b.durationHrs} hr</p>}
        {b.city && <p className="text-muted">{b.area ? b.area + ", " : ""}{b.city}</p>}
        {(b.reelerSlug || b.autoAssign) && <p className="text-cyan text-xs font-semibold">{b.autoAssign ? "Reelwala will assign" : `Reeler: ${b.reelerSlug}`}</p>}
      </div>
      <div className="mt-4 border-t border-fg/10 pt-4 space-y-2 text-sm">
        <AnimatePresence initial={false}>
          {rows.map(([l, v]) => (
            <motion.div key={l} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex justify-between"><span className="text-muted">{l}</span><span>{inr(v)}</span></motion.div>
          ))}
          {p.discount > 0 && <motion.div key="disc" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-between text-cyan"><span>Coupon {b.coupon?.code}</span><span>−{inr(p.discount)}</span></motion.div>}
        </AnimatePresence>
        <div className="flex justify-between border-t border-fg/10 pt-3 font-display text-xl font-bold"><span>Total</span><span>₹<CountUp value={p.total} /></span></div>
        <div className="flex justify-between text-xs text-muted"><span>{b.paymentMode === "TOKEN" ? "Pay now (30% token)" : "Pay now (full)"}</span><span className="text-fg font-semibold">{inr(p.payNow)}</span></div>
        {p.due > 0 && <div className="flex justify-between text-xs text-muted"><span>After shoot</span><span>{inr(p.due)}</span></div>}
      </div>
      <p className="mt-4 text-[11px] text-muted">Free cancellation till 24 hrs before. Prices incl. GST.</p>
    </div>
  );
}
