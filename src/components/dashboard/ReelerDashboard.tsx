"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { IndianRupee, CalendarDays, Film, Star, Wallet, UserCog, LogOut, Check, X, MapPin, Clock, Plus, Trash2, ArrowUp, ArrowDown, BadgeCheck, ShieldAlert, Link as LinkIcon, PartyPopper } from "lucide-react";
import toast from "react-hot-toast";
import { format, startOfWeek, subWeeks, isAfter } from "date-fns";
import AvailabilityCalendar from "@/components/profile/AvailabilityCalendar";
import ReelCard from "@/components/reels/ReelCard";
import Countdown from "./Countdown";
import MagneticButton from "@/components/ui/MagneticButton";
import CountUp from "@/components/ui/CountUp";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/status";
import { cn, inr, waLink } from "@/lib/utils";
import { OCCASIONS } from "@/lib/data/occasions";

const TABS = [["overview", "Overview", IndianRupee], ["shoots", "Shoots", CalendarDays], ["availability", "Availability", Clock], ["portfolio", "Portfolio", Film], ["reviews", "Reviews", Star], ["payouts", "Payouts", Wallet], ["profile", "Profile", UserCog]] as const;
const STYLES = ["cinematic", "trendy", "aesthetic", "fast-cut", "wedding", "urban"];
const inp = "h-11 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50";

export default function ReelerDashboard({ reeler, bookings, payouts, reviews, reels, blocked }: { reeler: any; bookings: any[]; payouts: any[]; reviews: any[]; reels: any[]; blocked: string[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("overview");
  const router = useRouter();
  const [newReel, setNewReel] = useState("");
  const [deliverUrls, setDeliverUrls] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState({ bio: reeler.bio || "", area: reeler.area || "", instagram: reeler.instagram || "", equipment: reeler.equipment || "", upiId: reeler.upiId || "", tags: reeler.tags as string[], styles: reeler.styles as string[], packages: Object.fromEntries(reeler.packages.map((p: any) => [p.key, p.price])) as Record<string, number> });

  const requests = bookings.filter((b) => b.acceptance === "PENDING" && b.status === "ASSIGNED");
  const upcoming = bookings.filter((b) => b.acceptance === "ACCEPTED" && ["ASSIGNED", "EDITING", "SHOOT_DONE"].includes(b.status));
  const earned = payouts.reduce((s, p) => s + p.net, 0);
  const pending = payouts.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.net, 0);
  const weeks = useMemo(() => Array.from({ length: 8 }, (_, i) => { const start = startOfWeek(subWeeks(new Date(), 7 - i)); const end = startOfWeek(subWeeks(new Date(), 6 - i)); return { label: format(start, "d MMM"), value: payouts.filter((p) => { const d = new Date(p.createdAt); return isAfter(d, start) && !isAfter(d, end); }).reduce((s, p) => s + p.net, 0) }; }), [payouts]);
  const max = Math.max(1, ...weeks.map((w) => w.value));
  const completeness = [reeler.avatar, reeler.bio, reeler.area, reeler.instagram, reeler.equipment, reels.length >= 3, reeler.upiId, reeler.tags.length > 0].filter(Boolean).length / 8;

  const act = async (id: string, action: string, extra: any = {}) => {
    const r = await fetch(`/api/reeler/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...extra }) });
    const d = await r.json();
    if (!r.ok) return toast.error(d.error);
    toast.success({ accept: "Shoot accepted 🎬", decline: "Declined. We'll reassign.", shoot_done: "Shoot marked done. 24-hr clock started ⏱", delivered: "Delivered! Payout queued 💸" }[action] || "Done");
    router.refresh();
  };
  const toggleDate = async (d: string) => { const r = await fetch("/api/reeler/availability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: d }) }); const j = await r.json(); toast.success(j.blocked ? `${d} blocked` : `${d} open again`); router.refresh(); };
  const addReel = async () => { const r = await fetch("/api/reeler/reels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: newReel }) }); const d = await r.json(); if (!r.ok) return toast.error(d.error); setNewReel(""); toast.success("Reel added"); router.refresh(); };
  const move = async (i: number, dir: -1 | 1) => { const ids = reels.map((x) => x.id); const j = i + dir; if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]]; await fetch("/api/reeler/reels", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: ids }) }); router.refresh(); };
  const del = async (id: string) => { if (!confirm("Remove this reel?")) return; await fetch("/api/reeler/reels", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); router.refresh(); };
  const saveProfile = async () => { const r = await fetch("/api/reeler/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) }); if (!r.ok) return toast.error("Could not save"); toast.success("Profile updated"); router.refresh(); };

  return (
    <div className="container pb-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={reeler.avatar || "https://i.pravatar.cc/120"} alt="" className="h-16 w-16 rounded-full object-cover ring-4 ring-pink/40" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Reeler dashboard</p>
            <h1 className="font-display text-h2 font-bold flex items-center gap-2">{reeler.displayName} {reeler.status === "VERIFIED" ? <BadgeCheck className="text-cyan" size={22} /> : <ShieldAlert className="text-orange" size={22} />}</h1>
            <p className="text-sm text-muted">{reeler.status === "VERIFIED" ? "Verified" : reeler.status === "PENDING" ? "Verification pending (1-2 days)" : reeler.status} · {reeler.area}, {reeler.city}</p>
          </div>
        </div>
        <div className="flex gap-2"><a href={`/reelers/${reeler.slug}`} className="h-10 rounded-full glass px-4 text-sm flex items-center">View public profile</a><button onClick={() => signOut({ callbackUrl: "/" })} className="h-10 rounded-full glass px-4 text-sm flex items-center gap-2"><LogOut size={14} /> Logout</button></div>
      </div>

      {completeness < 1 && <div className="mt-6 glass rounded-2xl p-4 border border-fg/10 flex items-center gap-4"><div className="flex-1"><div className="flex justify-between text-xs"><span className="font-semibold">Profile {Math.round(completeness * 100)}% complete</span><span className="text-muted">Complete profiles get 3× more bookings</span></div><div className="mt-2 h-2 rounded-full bg-fg/10 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${completeness * 100}%` }} className="h-full bg-brand" /></div></div><button onClick={() => setTab("profile")} className="text-sm font-semibold text-pink">Finish →</button></div>}

      <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar" data-lenis-prevent>
        {TABS.map(([k, l, I]) => <button key={k} onClick={() => setTab(k)} className={cn("relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all", tab === k ? "bg-brand text-white shadow-glow-sm" : "glass hover:bg-fg/10")}><I size={14} /> {l}{k === "shoots" && requests.length > 0 && <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-orange text-[10px] text-white flex items-center justify-center">{requests.length}</span>}</button>)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="mt-8">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[["Total earned", earned, "₹"], ["Pending payout", pending, "₹"], ["Reels delivered", reeler.delivered, ""], ["Rating", reeler.rating, "", 1]].map(([l, v, pre, dec]: any) => <div key={l} className="glass rounded-3xl p-5 border border-fg/10"><p className="text-xs text-muted">{l}</p><p className="mt-1 font-display text-3xl font-bold text-gradient"><CountUp value={v} prefix={pre} decimals={dec || 0} /></p></div>)}
              </div>
              <div className="glass rounded-3xl p-6 border border-fg/10">
                <div className="flex items-end justify-between"><div><p className="font-display text-xl font-semibold">Earnings, last 8 weeks</p><p className="text-xs text-muted">Net after 15% platform fee</p></div><p className="font-display text-2xl font-bold">{inr(weeks.reduce((s, w) => s + w.value, 0))}</p></div>
                <div className="mt-6 flex h-40 items-end gap-2">
                  {weeks.map((w, i) => <div key={w.label} className="flex-1 flex flex-col items-center gap-2"><motion.div initial={{ height: 0 }} animate={{ height: `${(w.value / max) * 100}%` }} transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 18 }} className="w-full rounded-t-xl bg-brand min-h-[4px] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 whitespace-nowrap">{inr(w.value)}</span></motion.div><span className="text-[10px] text-muted">{w.label}</span></div>)}
                </div>
              </div>
              {requests.length > 0 && <div className="glass gradient-border rounded-3xl p-6"><p className="font-display text-xl font-semibold flex items-center gap-2"><PartyPopper size={18} className="text-pink" /> {requests.length} new booking request{requests.length > 1 ? "s" : ""}</p><p className="text-sm text-muted mt-1">Accept within 30 minutes to keep your acceptance rate high.</p><MagneticButton onClick={() => setTab("shoots")} size="sm" className="mt-4">Review requests</MagneticButton></div>}
            </div>
          )}

          {tab === "shoots" && (
            <div className="space-y-8">
              {requests.length > 0 && <section><h2 className="font-display text-xl font-semibold">New requests</h2><div className="mt-4 grid gap-4 lg:grid-cols-2">{requests.map((b) => <div key={b.id} className="glass gradient-border rounded-3xl p-5"><div className="flex justify-between"><p className="font-display text-lg font-semibold">{b.occasion} · {b.packageKey}</p><span className="text-xs text-orange flex items-center gap-1"><Clock size={12} /><Countdown to={new Date(new Date(b.assignedAt).getTime() + 30 * 60000)} done="Expired" /></span></div><p className="mt-2 text-sm text-muted flex items-center gap-2"><CalendarDays size={14} />{format(new Date(b.date), "EEE d MMM")} · {b.startTime} · {b.durationHrs} hr</p><p className="text-sm text-muted flex items-center gap-2"><MapPin size={14} />{b.area || b.city} · {b.address}</p><p className="mt-2 text-sm">You earn <span className="font-display font-semibold text-gradient">{inr(Math.round(b.total * 0.85))}</span></p><div className="mt-4 flex gap-2"><button onClick={() => act(b.id, "accept")} className="flex-1 h-11 rounded-full bg-brand text-white font-semibold text-sm flex items-center justify-center gap-1"><Check size={16} /> Accept</button><button onClick={() => act(b.id, "decline")} className="h-11 rounded-full glass px-5 text-sm flex items-center gap-1"><X size={16} /> Decline</button></div></div>)}</div></section>}
              <section>
                <h2 className="font-display text-xl font-semibold">Upcoming & in progress</h2>
                {upcoming.length === 0 ? <p className="mt-3 text-sm text-muted">Nothing scheduled. Keep your calendar open and portfolio fresh.</p> :
                <div className="mt-4 grid gap-4 lg:grid-cols-2">{upcoming.map((b) => <div key={b.id} className="glass rounded-3xl p-5 border border-fg/10">
                  <div className="flex justify-between"><p className="font-display text-lg font-semibold">{b.occasion} · {b.code}</p><span className={cn("text-xs font-semibold", STATUS_TONE[b.status])}>{STATUS_LABEL[b.status]}</span></div>
                  <p className="mt-2 text-sm text-muted flex items-center gap-2"><CalendarDays size={14} />{format(new Date(b.date), "EEE d MMM")} · {b.startTime} · {b.durationHrs} hr</p>
                  <p className="text-sm text-muted flex items-center gap-2"><MapPin size={14} />{b.address}, {b.area || b.city}</p>
                  <p className="mt-2 text-xs text-muted">Client: {b.contactName} · <a className="text-pink" href={waLink(`Hi ${b.contactName}, ${reeler.displayName} here from Reelwala for your ${b.occasion} shoot (${b.code}).`)} target="_blank" rel="noreferrer">WhatsApp</a>{b.instructions && <> · “{b.instructions}”</>}</p>
                  {b.status === "ASSIGNED" && <button onClick={() => act(b.id, "shoot_done")} className="mt-4 h-11 w-full rounded-full bg-brand text-white font-semibold text-sm">Mark shoot done ✓</button>}
                  {b.status === "EDITING" && <div className="mt-4 space-y-2"><div className="flex justify-between text-xs"><span className="text-pink font-semibold">Deliver within</span><Countdown to={b.slaDeadline} className="font-display font-semibold" done="Overdue!" /></div><textarea rows={2} value={deliverUrls[b.id] || ""} onChange={(e) => setDeliverUrls({ ...deliverUrls, [b.id]: e.target.value })} placeholder="Paste reel links, one per line (Drive/Cloudinary/Instagram)" className={inp + " h-auto py-2 resize-none"} /><button onClick={() => act(b.id, "delivered", { deliverables: (deliverUrls[b.id] || "").split("\n").map((u) => u.trim()).filter(Boolean).map((url, i) => ({ url, name: `Reel ${i + 1}` })) })} className="h-11 w-full rounded-full bg-cyan text-black font-semibold text-sm">Mark delivered 🚀</button></div>}
                </div>)}</div>}
              </section>
              <section><h2 className="font-display text-xl font-semibold">History</h2><div className="mt-4 glass rounded-3xl border border-fg/10 overflow-hidden">{bookings.filter((b) => ["DELIVERED", "CANCELLED", "REFUNDED"].includes(b.status)).map((b) => <div key={b.id} className="flex justify-between px-5 py-3 text-sm border-b border-fg/5 last:border-0"><span>{b.occasion} · {format(new Date(b.date), "d MMM")} · {b.contactName}</span><span className={cn("text-xs font-semibold", STATUS_TONE[b.status])}>{STATUS_LABEL[b.status]}{b.lateFlag ? " · late" : ""}</span></div>)}</div></section>
            </div>
          )}

          {tab === "availability" && <div className="grid gap-6 lg:grid-cols-[420px_1fr]"><AvailabilityCalendar blocked={blocked} onChange={toggleDate} /><div className="glass rounded-3xl p-6 border border-fg/10 text-sm"><p className="font-display text-xl font-semibold">How it works</p><ul className="mt-3 space-y-2 text-muted"><li>· Tap a date to block it (travel, personal, other gigs).</li><li>· Booked dates are blocked automatically.</li><li>· Open dates show you in search for that day.</li><li>· Tap a blocked date to open it again.</li></ul><p className="mt-4 text-xs text-orange">Tip: keep weekends open. 70% of bookings are Fri to Sun.</p></div></div>}

          {tab === "portfolio" && (
            <div>
              <div className="flex gap-2"><div className={inp + " flex items-center p-0 pl-4 flex-1"}><LinkIcon size={14} className="text-muted mr-2" /><input value={newReel} onChange={(e) => setNewReel(e.target.value)} placeholder="Paste a reel video URL (mp4 / Cloudinary / Drive direct link)" className="h-full flex-1 bg-transparent text-sm outline-none" /></div><button onClick={addReel} className="h-11 rounded-full bg-brand px-5 text-white text-sm font-semibold flex items-center gap-1"><Plus size={14} /> Add</button></div>
              <p className="mt-2 text-xs text-muted">First reel is your cover. Direct uploads via UploadThing coming once keys are configured.</p>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{reels.map((x, i) => <div key={x.id}><ReelCard src={x.url} caption={i === 0 ? "Cover" : undefined} showControls={false} /><div className="mt-2 flex justify-center gap-1"><button onClick={() => move(i, -1)} className="h-8 w-8 rounded-full glass flex items-center justify-center"><ArrowUp size={12} /></button><button onClick={() => move(i, 1)} className="h-8 w-8 rounded-full glass flex items-center justify-center"><ArrowDown size={12} /></button><button onClick={() => del(x.id)} className="h-8 w-8 rounded-full glass flex items-center justify-center text-orange"><Trash2 size={12} /></button></div></div>)}</div>
            </div>
          )}

          {tab === "reviews" && (reviews.length === 0 ? <p className="text-muted">No reviews yet. They appear after your first delivered shoot.</p> : <div className="grid gap-4 md:grid-cols-2">{reviews.map((x) => <div key={x.id} className="glass rounded-3xl p-5 border border-fg/10"><div className="flex justify-between"><p className="font-semibold text-sm">{x.name}</p><span className="flex gap-0.5">{Array.from({ length: x.rating }).map((_, k) => <Star key={k} size={12} className="fill-orange text-orange" />)}</span></div><p className="text-[11px] text-muted">{x.occasion} · {format(new Date(x.at), "MMM yyyy")}</p><p className="mt-2 text-sm">{x.text}</p></div>)}</div>)}

          {tab === "payouts" && (
            <div className="glass rounded-3xl border border-fg/10 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-xs text-muted border-b border-fg/10"><span>Booking</span><span>Gross</span><span>Net (85%)</span><span>Status</span></div>
              {payouts.length === 0 && <p className="p-5 text-sm text-muted">Payouts appear after a booking is fully paid and delivered. T+1 day to your UPI.</p>}
              {payouts.map((p) => <div key={p.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-sm border-b border-fg/5 last:border-0"><span>{p.code} · {format(new Date(p.createdAt), "d MMM")}</span><span className="text-muted">{inr(p.gross)}</span><span className="font-semibold">{inr(p.net)}</span><span className={cn("text-xs font-semibold", p.status === "PAID" ? "text-cyan" : "text-orange")}>{p.status}</span></div>)}
            </div>
          )}

          {tab === "profile" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <label className="block"><span className="text-xs font-semibold uppercase tracking-wider text-muted">Bio</span><textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className={inp + " mt-2 h-auto py-3 resize-none"} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block"><span className="text-xs font-semibold uppercase tracking-wider text-muted">Area</span><input value={profile.area} onChange={(e) => setProfile({ ...profile, area: e.target.value })} className={inp + " mt-2"} /></label>
                  <label className="block"><span className="text-xs font-semibold uppercase tracking-wider text-muted">Instagram</span><input value={profile.instagram} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} className={inp + " mt-2"} /></label>
                </div>
                <label className="block"><span className="text-xs font-semibold uppercase tracking-wider text-muted">Equipment</span><input value={profile.equipment} onChange={(e) => setProfile({ ...profile, equipment: e.target.value })} className={inp + " mt-2"} /></label>
                <label className="block"><span className="text-xs font-semibold uppercase tracking-wider text-muted">UPI ID for payouts</span><input value={profile.upiId} onChange={(e) => setProfile({ ...profile, upiId: e.target.value })} placeholder="name@upi" className={inp + " mt-2"} /></label>
              </div>
              <div className="space-y-4">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted">Occasions you shoot</p><div className="mt-2 flex flex-wrap gap-2">{OCCASIONS.map((o) => { const on = profile.tags.includes(o.name.split(" /")[0]); return <button key={o.slug} onClick={() => setProfile({ ...profile, tags: on ? profile.tags.filter((t) => t !== o.name.split(" /")[0]) : [...profile.tags, o.name.split(" /")[0]] })} className={cn("rounded-full px-3 py-1.5 text-xs border", on ? "bg-brand text-white border-transparent" : "border-fg/15")}>{o.emoji} {o.name}</button>; })}</div></div>
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted">Style</p><div className="mt-2 flex flex-wrap gap-2">{STYLES.map((s) => { const on = profile.styles.includes(s); return <button key={s} onClick={() => setProfile({ ...profile, styles: on ? profile.styles.filter((t) => t !== s) : [...profile.styles, s] })} className={cn("rounded-full px-3 py-1.5 text-xs border capitalize", on ? "bg-cyan/20 text-cyan border-cyan/40" : "border-fg/15")}>{s}</button>; })}</div></div>
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted">Your package prices (±20% of base)</p><div className="mt-2 grid grid-cols-3 gap-2">{[["starter", 999], ["party", 1999], ["event", 4999]].map(([k, base]: any) => <label key={k} className="block"><span className="text-[11px] text-muted capitalize">{k} (base {inr(base)})</span><input type="number" value={profile.packages[k] || base} onChange={(e) => setProfile({ ...profile, packages: { ...profile.packages, [k]: Number(e.target.value) } })} className={inp + " mt-1"} /></label>)}</div></div>
                <MagneticButton onClick={saveProfile} className="w-full">Save profile</MagneticButton>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
