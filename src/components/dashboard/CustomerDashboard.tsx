"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, MessageCircle, Download, Share2, RotateCcw, XCircle, Receipt, Home, LifeBuoy, Film, LogOut, Gift, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import StatusTracker from "./StatusTracker";
import Countdown from "./Countdown";
import ReelCard from "@/components/reels/ReelCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/status";
import { cn, inr, waLink } from "@/lib/utils";
import { useUI } from "@/store/ui";

const TABS = [["bookings", "Bookings", CalendarDays], ["reels", "My reels", Film], ["payments", "Payments", Receipt], ["addresses", "Addresses", Home], ["support", "Support", LifeBuoy]] as const;

export default function CustomerDashboard({ user, bookings, editOrders, payments, addresses }: { user: any; bookings: any[]; editOrders: any[]; payments: any[]; addresses: any[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("bookings");
  const router = useRouter();
  const openViewer = useUI((s) => s.openViewer);
  const upcoming = bookings.filter((b) => !["DELIVERED", "CANCELLED", "REFUNDED"].includes(b.status));
  const delivered = bookings.filter((b) => b.status === "DELIVERED");
  const act = async (id: string, action: string) => {
    if (action === "cancel" && !confirm("Cancel this booking?")) return;
    const r = await fetch(`/api/me/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    const d = await r.json();
    if (!r.ok) return toast.error(d.error);
    toast.success(action === "cancel" ? (d.free ? `Cancelled. ${inr(d.refund)} refund in 5-7 days.` : "Cancelled. Token retained as per policy.") : "Revision requested. Reeler will update within 24 hrs.");
    router.refresh();
  };

  return (
    <div className="container pb-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Dashboard</p>
          <h1 className="mt-2 font-display text-h1 font-bold">Hi {user.name?.split(" ")[0] || "there"} 👋</h1>
          <p className="mt-1 text-muted">{upcoming.length} upcoming · {delivered.length} delivered · {inr(user.credits)} credits</p>
        </div>
        <div className="flex gap-2">
          <MagneticButton href="/book" size="sm" glow>Book a Reeler</MagneticButton>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="h-10 rounded-full glass px-4 text-sm flex items-center gap-2"><LogOut size={14} /> Logout</button>
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar" data-lenis-prevent>
        {TABS.map(([k, l, I]) => <button key={k} onClick={() => setTab(k)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all", tab === k ? "bg-brand text-white shadow-glow-sm" : "glass hover:bg-fg/10")}><I size={14} /> {l}</button>)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="mt-8">
          {tab === "bookings" && (
            bookings.length === 0 ? <Empty title="Abhi tak koi booking nahi" sub="Book your first reeler and the shoot shows up here with live tracking." cta="Book a Reeler" href="/book" /> :
            <div className="grid gap-5 lg:grid-cols-2">
              {bookings.map((b) => {
                const shootAt = new Date(b.date); const [h, m] = b.startTime.split(":").map(Number); shootAt.setHours(h, m || 0);
                const live = !["DELIVERED", "CANCELLED", "REFUNDED"].includes(b.status);
                return (
                  <div key={b.id} className={cn("glass rounded-3xl p-5 border", live ? "gradient-border" : "border-fg/10")}>
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-display text-xl font-semibold">{b.occasion}</p><p className="text-xs text-muted">{b.code} · {b.packageKey} package</p></div>
                      <span className={cn("rounded-full bg-fg/5 px-3 py-1 text-xs font-semibold", STATUS_TONE[b.status])}>{STATUS_LABEL[b.status]}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <p className="flex items-center gap-2 text-muted"><CalendarDays size={14} className="text-pink" />{format(new Date(b.date), "EEE, d MMM")} · {b.startTime}</p>
                      <p className="flex items-center gap-2 text-muted truncate"><MapPin size={14} className="text-pink" />{b.area || b.city}</p>
                    </div>
                    {live && shootAt.getTime() > Date.now() && <div className="mt-3 rounded-2xl bg-fg/5 px-3 py-2 text-xs flex justify-between"><span className="text-muted">Shoot in</span><Countdown to={shootAt} className="font-display font-semibold text-sm" /></div>}
                    <div className="mt-4"><StatusTracker status={b.status} slaDeadline={b.slaDeadline} /></div>
                    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-fg/5 p-3">
                      {b.reeler ? (<>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.reeler.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-pink/50" />
                        <div className="min-w-0 flex-1"><Link href={`/reelers/${b.reeler.slug}`} className="font-semibold text-sm hover:underline">{b.reeler.name}</Link><p className="text-xs text-muted">{b.reeler.area} · replies {b.reeler.responseTime}</p></div>
                        <a href={waLink(`Hi ${b.reeler.name}! Booking ${b.code} for ${b.occasion} on ${format(new Date(b.date), "d MMM")}.`)} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-[#25D366] text-white flex items-center justify-center"><MessageCircle size={16} /></a>
                      </>) : <p className="text-sm text-muted">✨ Reeler being assigned. We&apos;ll WhatsApp you within 15 min.</p>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {b.status === "DELIVERED" && <button onClick={() => setTab("reels")} className="rounded-full bg-brand px-3 py-1.5 text-white font-semibold flex items-center gap-1"><Download size={12} /> Get reels</button>}
                      {b.status === "DELIVERED" && !b.revisionUsed && <button onClick={() => act(b.id, "revision")} className="rounded-full glass px-3 py-1.5 flex items-center gap-1"><RotateCcw size={12} /> Free revision</button>}
                      {["BOOKED", "ASSIGNED", "PENDING_PAYMENT"].includes(b.status) && <button onClick={() => act(b.id, "cancel")} className="rounded-full glass px-3 py-1.5 text-muted hover:text-orange flex items-center gap-1"><XCircle size={12} /> Cancel</button>}
                      {b.amountDue > 0 && live && <span className="rounded-full bg-orange/15 text-orange px-3 py-1.5">Due after shoot: {inr(b.amountDue)}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "reels" && (() => {
            const items = [...delivered.flatMap((b) => (b.deliverables || []).map((d: any) => ({ ...d, code: b.code, occasion: b.occasion }))), ...editOrders.filter((o) => o.status === "DELIVERED").flatMap((o) => (o.deliverables || []).map((d: any) => ({ ...d, code: o.code, occasion: "Edit order" })))];
            return items.length === 0 ? <Empty title="Reels will land here" sub="Delivered reels show up here to download, request a revision, or share straight to Instagram." cta="Edit my own clips" href="/edit" /> :
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((d, i) => (
                  <div key={i}>
                    <ReelCard src={d.url} caption={d.name} credit={d.code} onClick={() => openViewer(items.map((x) => ({ src: x.url, caption: x.name })), i)} />
                    <div className="mt-2 flex gap-1.5">
                      <a href={d.url} download className="flex-1 rounded-full glass py-1.5 text-center text-xs font-semibold flex items-center justify-center gap-1"><Download size={12} /> Save</a>
                      <button onClick={() => { navigator.share?.({ url: d.url, title: "My Reelwala reel" }).catch(() => {}); }} className="rounded-full glass px-3 py-1.5 text-xs"><Share2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>;
          })()}

          {tab === "payments" && (
            payments.length === 0 ? <Empty title="No payments yet" sub="Invoices for every booking and edit order appear here." /> :
            <div className="glass rounded-3xl border border-fg/10 overflow-hidden">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 border-b border-fg/5 px-5 py-4 text-sm last:border-0">
                  <div><p className="font-semibold">{p.ref} · {p.kind}</p><p className="text-xs text-muted">{format(new Date(p.createdAt), "d MMM yyyy, h:mm a")} · {p.provider}</p></div>
                  <div className="text-right"><p className="font-display font-semibold">{inr(p.amount)}</p><p className={cn("text-xs", p.status === "PAID" ? "text-cyan" : p.status === "REFUNDED" ? "text-orange" : "text-muted")}>{p.status}{p.refundAmount ? ` · ₹${p.refundAmount} refunded` : ""}</p></div>
                  <button onClick={() => toast("Invoice PDF coming soon. Email copy already sent.", { icon: "🧾" })} className="h-9 w-9 rounded-full glass flex items-center justify-center"><Receipt size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {tab === "addresses" && (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((a) => <div key={a.id} className="glass rounded-3xl p-5 border border-fg/10"><p className="font-semibold">{a.label || "Saved address"}</p><p className="text-sm text-muted mt-1">{a.line}, {a.area ? a.area + ", " : ""}{a.city}</p></div>)}
              <div className="glass rounded-3xl p-5 border border-dashed border-fg/20 text-sm text-muted">Addresses from your bookings are saved automatically. Pick them in one tap next time.</div>
            </div>
          )}

          {tab === "support" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass gradient-border rounded-3xl p-6"><p className="font-display text-xl font-semibold">WhatsApp us</p><p className="text-sm text-muted mt-1">Human replies in minutes, 9 AM to 11 PM.</p><MagneticButton href={waLink(`Hi! Need help with my account (${user.phone || user.email}).`)} className="mt-4" size="sm"><MessageCircle size={14} /> Chat now</MagneticButton></div>
              <div className="glass rounded-3xl p-6 border border-fg/10"><p className="font-display text-xl font-semibold flex items-center gap-2"><Gift size={18} className="text-pink" /> Refer & earn ₹100</p><p className="text-sm text-muted mt-1">Friend gets ₹100 off, you get ₹100 credit after their first shoot.</p><button onClick={() => { navigator.clipboard?.writeText(`${location.origin}/book?ref=${user.referralCode}`); toast.success("Referral link copied"); }} className="mt-4 flex items-center gap-2 rounded-full glass px-4 py-2 font-display font-semibold">{user.referralCode} <Copy size={14} className="text-muted" /></button></div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Empty({ title, sub, cta, href }: { title: string; sub: string; cta?: string; href?: string }) {
  return <div className="glass rounded-3xl p-10 text-center border border-fg/10"><p className="font-display text-2xl font-semibold">{title}</p><p className="mt-2 text-muted max-w-md mx-auto">{sub}</p>{cta && href && <MagneticButton href={href} className="mt-5">{cta}</MagneticButton>}</div>;
}
