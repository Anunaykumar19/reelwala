import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PricingTeaser from "@/components/home/PricingTeaser";
import FAQ from "@/components/home/FAQ";
import Reveal from "@/components/ui/Reveal";
import { ADDONS, EDIT_PRICING, PACKAGES } from "@/lib/data/packages";
import { LIVE_CITIES } from "@/lib/data/cities";
import { inr } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing", description: "Reel shoots from ₹999, edit-only from ₹199. Transparent packages, add-ons and what's included." };

const INCLUDED = [
  ["Shoot duration", "1 hr", "3 hrs", "Full day"],
  ["Edited reels", "2", "5", "10+"],
  ["Trending audio sync", true, true, true],
  ["Captions & transitions", false, true, true],
  ["Cinematic colour grade", false, false, true],
  ["Raw highlights", false, "15 clips", "All footage"],
  ["Free revisions", "1", "1", "2"],
  ["Delivery", "24 hrs", "24 hrs", "Priority 24 hrs"],
  ["Dedicated support", false, false, true],
];
const PRICING_FAQ = [
  { q: "Kya prices me GST included hai?", a: "Haan. Every price you see is final, GST included. The invoice lands in your email instantly." },
  { q: "Reeler ke prices alag kyun dikhte hain?", a: "Verified reelers can set their package price within ±20% of the platform base depending on experience and demand. You always see the exact price before paying." },
  { q: "Token vs full payment?", a: "Pay 30% token to lock the slot and the rest after the shoot, or pay in full. Both are via Razorpay (UPI, cards, wallets)." },
  { q: "Travel charges?", a: "None within the city. For venues beyond 25 km of city centre, the reeler may add actual travel cost, shown before you confirm." },
  { q: "Edit-only express kaise kaam karta hai?", a: "Upload clips, pick Express and your reel is delivered within 6 hours of payment, 9 AM to 11 PM." },
];

export default function PricingPage() {
  return (
    <PageShell>
      <div className="-mt-16"><PricingTeaser /></div>
      <section className="container py-10">
        <Reveal>
          <h2 className="font-display text-h2 font-semibold">What&apos;s <span className="text-gradient">included</span></h2>
          <div className="mt-8 overflow-x-auto rounded-4xl glass border border-fg/10" data-lenis-prevent>
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b border-fg/10 bg-fg/[0.03]"><th className="p-4 text-left font-medium text-muted">Feature</th>{PACKAGES.map((p) => <th key={p.id} className="p-4 text-center"><span className="font-display text-base">{p.name}</span><br /><span className="text-muted text-xs">{inr(p.price)}{p.id === "event" ? "+" : ""}</span></th>)}</tr></thead>
              <tbody>{INCLUDED.map((row) => <tr key={String(row[0])} className="border-b border-fg/5 last:border-0 hover:bg-fg/[0.03]"><td className="p-4 font-medium">{row[0]}</td>{row.slice(1).map((v, i) => <td key={i} className="p-4 text-center">{v === true ? <Check size={16} className="inline text-cyan" /> : v === false ? <X size={16} className="inline text-fg/25" /> : <span>{v}</span>}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Reveal>
      </section>
      <section className="container py-10 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-h2 font-semibold">Add-ons</h2>
          <div className="mt-6 space-y-3">{ADDONS.map((a) => <div key={a.id} className="glass rounded-2xl p-4 border border-fg/10 flex items-center justify-between"><div><p className="font-semibold">{a.name}</p><p className="text-xs text-muted">{a.desc}</p></div><p className="font-display text-xl font-semibold">{inr(a.price)} <span className="text-xs text-muted font-sans">{a.unit}</span></p></div>)}</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="edit" className="font-display text-h2 font-semibold">Edit-only</h2>
          <div className="mt-6 glass gradient-border rounded-3xl p-6">
            <div className="flex items-baseline gap-2"><p className="font-display text-5xl font-bold">{inr(EDIT_PRICING.perReel)}</p><p className="text-muted">/ reel · 24-hr delivery</p></div>
            <div className="mt-2 flex items-baseline gap-2"><p className="font-display text-2xl font-semibold">{inr(EDIT_PRICING.expressPerReel)}</p><p className="text-muted text-sm">/ reel · Express 6-hr</p></div>
            <ul className="mt-5 space-y-2 text-sm">{["Any phone or camera footage, up to 2 GB per order", "Styles: " + EDIT_PRICING.styles.join(", "), "Trending or licensed music, captions, colour grade", "1 free revision per reel", "Bulk: 5+ reels get 10% off automatically"].map((t) => <li key={t} className="flex gap-2"><Check size={16} className="text-cyan shrink-0 mt-0.5" />{t}</li>)}</ul>
          </div>
          <p className="mt-6 text-sm text-muted">Live in {LIVE_CITIES.map((c) => c.name).join(", ")}. Same prices in every city. Edit-only works from anywhere in India.</p>
        </Reveal>
      </section>
      <FAQ items={PRICING_FAQ} />
    </PageShell>
  );
}
