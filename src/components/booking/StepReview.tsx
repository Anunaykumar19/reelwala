"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShieldCheck, Tag, Loader2, Lock } from "lucide-react";
import { useBooking } from "@/store/booking";
import { computePrice } from "@/lib/pricing";
import { cn, inr } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { useRazorpay } from "@/hooks/useRazorpay";

export default function StepReview() {
  const b = useBooking();
  const router = useRouter();
  const { open } = useRazorpay();
  const [code, setCode] = useState(b.coupon?.code || "");
  const [checking, setChecking] = useState(false);
  const [paying, setPaying] = useState(false);
  const p = computePrice({ packageKey: b.packageKey, addons: b.addons, extraReels: b.extraReels, coupon: b.coupon, paymentMode: b.paymentMode });

  const applyCoupon = async () => {
    if (!code.trim()) return b.set({ coupon: null });
    setChecking(true);
    const r = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, subtotal: p.subtotal }) });
    const d = await r.json(); setChecking(false);
    if (!r.ok) { b.set({ coupon: null }); return toast.error(d.error || "Invalid coupon"); }
    b.set({ coupon: d.coupon }); toast.success(`${d.coupon.code} applied 🎉`);
  };

  const pay = async () => {
    setPaying(true);
    try {
      const r = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...b, couponCode: b.coupon?.code }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Booking failed");
      const done = () => { b.reset(); router.push(`/book/success/${d.booking.code}`); };
      if (d.payment.provider === "razorpay") {
        await open({ keyId: d.payment.keyId, orderId: d.payment.orderId, amount: d.payment.amount, description: `${b.occasion} shoot · ${d.booking.code}`, prefill: d.payment.prefill,
          onSuccess: async (res) => { const v = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(res) }); if (v.ok) done(); else toast.error("Payment verification failed. WhatsApp us with your booking code " + d.booking.code); },
          onDismiss: () => { setPaying(false); toast("Payment cancelled. Your draft is saved.", { icon: "💾" }); } });
      } else {
        const s = await fetch("/api/payments/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: d.payment.orderId }) });
        if (!s.ok) throw new Error("Simulated payment failed");
        done();
      }
    } catch (e: any) { toast.error(e.message); setPaying(false); }
  };

  return (
    <div>
      <h2 className="font-display text-h2 font-semibold">Review & <span className="text-gradient">pay.</span></h2>
      <p className="mt-2 text-muted">Last step. Token now, baaki shoot ke baad.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {([["TOKEN", "Pay 30% token", `${inr(p.token)} now · ${inr(p.total - p.token)} after shoot`], ["FULL", "Pay in full", `${inr(p.total)} now · nothing later`]] as const).map(([k, t, s]) => (
          <button key={k} onClick={() => b.set({ paymentMode: k })} className={cn("rounded-3xl p-5 text-left border transition-all", b.paymentMode === k ? "glass gradient-border shadow-glow" : "glass border-fg/10 hover:border-fg/30")}>
            <p className="font-display text-lg font-semibold">{t}</p><p className="text-xs text-muted mt-1">{s}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <div className="flex h-12 flex-1 items-center rounded-2xl bg-surface-2 border border-fg/10 px-4 focus-within:ring-2 focus-within:ring-pink/50"><Tag size={14} className="text-muted mr-2" /><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code (try FIRST100)" className="flex-1 bg-transparent text-sm outline-none uppercase" /></div>
        <button onClick={applyCoupon} disabled={checking} className="h-12 rounded-2xl glass px-5 text-sm font-semibold">{checking ? <Loader2 size={16} className="animate-spin" /> : "Apply"}</button>
      </div>

      <div className="mt-6 glass rounded-3xl p-5 border border-fg/10 text-sm space-y-2">
        <div className="flex justify-between"><span className="text-muted">Occasion</span><span className="font-medium">{b.occasion}</span></div>
        <div className="flex justify-between"><span className="text-muted">When</span><span className="font-medium">{b.date} · {b.startTime} · {b.durationHrs} hr</span></div>
        <div className="flex justify-between"><span className="text-muted">Where</span><span className="font-medium text-right max-w-[60%] truncate">{b.address}, {b.area ? b.area + ", " : ""}{b.city}</span></div>
        <div className="flex justify-between"><span className="text-muted">Reeler</span><span className="font-medium">{b.autoAssign ? "Auto-assign (15 min)" : b.reelerSlug}</span></div>
        <div className="flex justify-between"><span className="text-muted">Contact</span><span className="font-medium">{b.contactName} · +91 {b.contactPhone}</span></div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={b.back} className="text-sm text-muted hover:text-fg">← Back</button>
        <MagneticButton onClick={pay} size="lg" glow disabled={paying} className="w-full sm:w-auto">{paying ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : <><Lock size={16} /> Pay {inr(p.payNow)} securely</>}</MagneticButton>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-muted"><ShieldCheck size={14} className="text-cyan" /> UPI, cards, wallets via Razorpay. Free cancellation till 24 hrs before the shoot. Token non-refundable within 24 hrs.</p>
    </div>
  );
}
