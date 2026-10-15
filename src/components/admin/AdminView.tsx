"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, CalendarDays, Users, Scissors, Wallet, Zap, Ticket, Building2, LogOut, Search, AlertTriangle, Check, X, Play } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import CountUp from "@/components/ui/CountUp";
import { STATUS_LABEL, STATUS_TONE, STATUS_ORDER } from "@/lib/status";
import { cn, inr } from "@/lib/utils";
import { useUI } from "@/store/ui";

const TABS = [["overview", "Overview", LayoutDashboard], ["bookings", "Bookings", CalendarDays], ["reelers", "Reelers", Users], ["edits", "Edit queue", Scissors], ["payments", "Payments", Wallet], ["quick", "Quick requests", Zap], ["coupons", "Coupons", Ticket], ["cities", "Cities", Building2]] as const;
const inp = "h-10 rounded-xl bg-surface-2 border border-fg/10 px-3 text-sm outline-none focus:ring-2 focus:ring-pink/50";

export default function AdminView({ kpis, bookings, reelers, editOrders, payments, quick, coupons, cities }: any) {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("overview");
  const [q, setQ] = useState("");
  const [coupon, setCoupon] = useState({ code: "", type: "FLAT", value: 100, minAmount: 999, maxUses: "" });
  const router = useRouter();
  const openViewer = useUI((s) => s.openViewer);
  const call = async (url: string, body: any, ok: string) => { const r = await fetch(url, { method: body.method || "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const d = await r.json().catch(() => ({})); if (!r.ok) return toast.error(d.error || "Failed"); toast.success(ok); router.refresh(); };
  const filtered = bookings.filter((b: any) => !q || [b.code, b.contactName, b.contactPhone, b.occasion, b.reeler?.name].join(" ").toLowerCase().includes(q.toLowerCase()));
  const late = bookings.filter((b: any) => b.lateFlag || (b.slaDeadline && b.status === "EDITING" && new Date(b.slaDeadline) < new Date()));

  return (
    <div className="container pb-24">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Admin</p><h1 className="mt-1 font-display text-h2 font-bold">Reelwala Ops</h1></div>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="h-10 rounded-full glass px-4 text-sm flex items-center gap-2 self-start"><LogOut size={14} /> Logout</button>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar" data-lenis-prevent>{TABS.map(([k, l, I]) => <button key={k} onClick={() => setTab(k)} className={cn("relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium", tab === k ? "bg-brand text-white shadow-glow-sm" : "glass hover:bg-fg/10")}><I size={14} /> {l}{k === "reelers" && kpis.pendingReelers > 0 && <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-orange text-[10px] text-white flex items-center justify-center">{kpis.pendingReelers}</span>}</button>)}</div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-8">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
                {[["Revenue (paid)", kpis.revenue, "₹"], ["Platform fee", kpis.commission, "₹"], ["Bookings", kpis.bookings, ""], ["Delivered", kpis.delivered, ""], ["Reelers live", kpis.reelers, ""], ["Edit orders", kpis.edits, ""]].map(([l, v, pre]: any) => <div key={l} className="glass rounded-3xl p-5 border border-fg/10"><p className="text-xs text-muted">{l}</p><p className="mt-1 font-display text-3xl font-bold text-gradient"><CountUp value={v} prefix={pre} /></p></div>)}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="glass rounded-3xl p-5 border border-fg/10"><p className="font-display text-lg font-semibold flex items-center gap-2"><AlertTriangle size={16} className="text-orange" /> Needs attention</p><ul className="mt-3 space-y-2 text-sm">{bookings.filter((b: any) => b.autoAssign && !b.reeler && !["CANCELLED", "REFUNDED", "DELIVERED"].includes(b.status)).map((b: any) => <li key={b.id} className="flex justify-between"><span>{b.code} · {b.occasion} · {b.city} · {format(new Date(b.date), "d MMM")}</span><button onClick={() => { setTab("bookings"); setQ(b.code); }} className="text-pink text-xs font-semibold">Assign →</button></li>)}{late.map((b: any) => <li key={b.id} className="flex justify-between text-orange"><span>{b.code} late delivery · {b.reeler?.name}</span><button onClick={() => { setTab("bookings"); setQ(b.code); }} className="text-xs font-semibold">Review →</button></li>)}{kpis.pendingReelers > 0 && <li className="flex justify-between"><span>{kpis.pendingReelers} reeler application{kpis.pendingReelers > 1 ? "s" : ""} pending</span><button onClick={() => setTab("reelers")} className="text-pink text-xs font-semibold">Review →</button></li>}{quick.filter((x: any) => x.status === "NEW").length > 0 && <li className="flex justify-between"><span>{quick.filter((x: any) => x.status === "NEW").length} quick requests to call</span><button onClick={() => setTab("quick")} className="text-pink text-xs font-semibold">Open →</button></li>}</ul></div>
                <div className="glass rounded-3xl p-5 border border-fg/10"><p className="font-display text-lg font-semibold">Bookings by status</p><div className="mt-3 space-y-2">{STATUS_ORDER.concat(["CANCELLED", "REFUNDED"]).map((s) => { const n = bookings.filter((b: any) => b.status === s).length; return <div key={s} className="flex items-center gap-3 text-xs"><span className="w-28 text-muted">{STATUS_LABEL[s]}</span><div className="flex-1 h-2 rounded-full bg-fg/10 overflow-hidden"><div className="h-full bg-brand" style={{ width: `${(n / Math.max(1, bookings.length)) * 100}%` }} /></div><span className="w-6 text-right">{n}</span></div>; })}</div></div>
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div>
              <div className="flex items-center gap-2"><div className={inp + " flex items-center flex-1 max-w-md"}><Search size={14} className="text-muted mr-2" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code, name, phone, occasion…" className="flex-1 bg-transparent outline-none" /></div><span className="text-xs text-muted">{filtered.length} bookings</span></div>
              <div className="mt-4 overflow-x-auto rounded-3xl glass border border-fg/10" data-lenis-prevent>
                <table className="w-full min-w-[980px] text-sm">
                  <thead><tr className="text-xs text-muted border-b border-fg/10">{["Code", "Customer", "Shoot", "City", "Reeler", "Amount", "Status", "Actions"].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr></thead>
                  <tbody>{filtered.map((b: any) => (
                    <tr key={b.id} className="border-b border-fg/5 last:border-0 hover:bg-fg/[0.03] align-top">
                      <td className="px-4 py-3 font-display font-semibold">{b.code}{b.lateFlag && <span className="ml-1 text-[10px] text-orange">LATE</span>}</td>
                      <td className="px-4 py-3">{b.contactName}<br /><span className="text-xs text-muted">{b.contactPhone}</span></td>
                      <td className="px-4 py-3">{b.occasion} · {b.packageKey}<br /><span className="text-xs text-muted">{format(new Date(b.date), "d MMM")} {b.startTime} · {b.durationHrs}h</span></td>
                      <td className="px-4 py-3">{b.city}<br /><span className="text-xs text-muted">{b.area}</span></td>
                      <td className="px-4 py-3">
                        <select value={b.reeler?.id || ""} onChange={(e) => e.target.value && call("/api/admin/bookings", { id: b.id, action: "assign", reelerId: e.target.value }, "Reeler assigned")} className={inp + " w-40"}><option value="">{b.autoAssign ? "⚠ Unassigned" : "—"}</option>{reelers.filter((r: any) => r.city === b.city && r.status === "VERIFIED").map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                        {b.reeler && <p className="text-[11px] text-muted mt-1">{b.acceptance === "ACCEPTED" ? "✓ accepted" : b.acceptance === "DECLINED" ? "✗ declined" : "awaiting accept"}</p>}
                      </td>
                      <td className="px-4 py-3">{inr(b.total)}<br /><span className={cn("text-xs", b.amountDue > 0 ? "text-orange" : "text-cyan")}>{b.amountDue > 0 ? `due ${inr(b.amountDue)}` : "paid"}</span></td>
                      <td className="px-4 py-3"><span className={cn("text-xs font-semibold", STATUS_TONE[b.status])}>{STATUS_LABEL[b.status]}</span></td>
                      <td className="px-4 py-3"><select value={b.status} onChange={(e) => call("/api/admin/bookings", { id: b.id, action: "status", status: e.target.value }, "Status updated")} className={inp + " w-40"}>{STATUS_ORDER.concat(["CANCELLED", "REFUNDED"]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "reelers" && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...reelers].sort((a: any, b: any) => (a.status === "PENDING" ? -1 : 1) - (b.status === "PENDING" ? -1 : 1)).map((r: any) => (
                <div key={r.id} className={cn("glass rounded-3xl p-4 border", r.status === "PENDING" ? "gradient-border" : "border-fg/10")}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.avatar || "https://i.pravatar.cc/80"} alt="" className="h-11 w-11 rounded-full object-cover" />
                    <div className="min-w-0 flex-1"><p className="font-semibold truncate">{r.name}</p><p className="text-xs text-muted">{r.area}, {r.city} · {r.instagram}</p></div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", r.status === "VERIFIED" ? "bg-cyan/20 text-cyan" : r.status === "PENDING" ? "bg-orange/20 text-orange" : "bg-fg/10 text-muted")}>{r.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{r.equipment} · ID: {r.idDocUrl ? "uploaded" : "missing"} · UPI: {r.upiId || "—"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">{r.reels.slice(0, 3).map((u: string, i: number) => <button key={u + i} onClick={() => openViewer(r.reels.map((x: string) => ({ src: x, reelerName: r.name })), i)} className="relative aspect-reel rounded-xl overflow-hidden bg-black"><video src={u} muted preload="metadata" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center text-white"><Play size={16} /></span></button>)}</div>
                  <div className="mt-3 flex gap-2">
                    {r.status !== "VERIFIED" && <button onClick={() => call("/api/admin/reelers", { id: r.id, status: "VERIFIED" }, "Verified ✓")} className="flex-1 h-9 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center gap-1"><Check size={12} /> Verify</button>}
                    {r.status === "PENDING" && <button onClick={() => call("/api/admin/reelers", { id: r.id, status: "REJECTED" }, "Rejected")} className="h-9 rounded-full glass px-4 text-xs flex items-center gap-1"><X size={12} /> Reject</button>}
                    {r.status === "VERIFIED" && <button onClick={() => call("/api/admin/reelers", { id: r.id, status: "SUSPENDED" }, "Suspended")} className="h-9 rounded-full glass px-4 text-xs text-orange">Suspend</button>}
                    {r.status === "SUSPENDED" && <button onClick={() => call("/api/admin/reelers", { id: r.id, status: "VERIFIED" }, "Reinstated")} className="h-9 rounded-full glass px-4 text-xs">Reinstate</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "edits" && (
            <div className="overflow-x-auto rounded-3xl glass border border-fg/10" data-lenis-prevent>
              <table className="w-full min-w-[760px] text-sm"><thead><tr className="text-xs text-muted border-b border-fg/10">{["Order", "Customer", "Brief", "Clips", "Total", "SLA", "Status"].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr></thead>
              <tbody>{editOrders.map((o: any) => <tr key={o.id} className="border-b border-fg/5 last:border-0"><td className="px-4 py-3 font-display font-semibold">{o.code}</td><td className="px-4 py-3">{o.user}<br /><span className="text-xs text-muted">{o.phone}</span></td><td className="px-4 py-3">{o.reelCount} × {o.style}<br /><span className="text-xs text-muted">{o.musicVibe}{o.captions ? " · captions" : ""}{o.express ? " · EXPRESS" : ""}</span></td><td className="px-4 py-3">{o.fileCount}</td><td className="px-4 py-3">{inr(o.total)}</td><td className="px-4 py-3 text-xs">{o.slaDeadline ? format(new Date(o.slaDeadline), "d MMM h:mm a") : "—"}</td><td className="px-4 py-3"><select value={o.status} onChange={(e) => call("/api/admin/edit-orders", { id: o.id, status: e.target.value }, "Updated")} className={inp}>{["PENDING_PAYMENT", "QUEUED", "EDITING", "DELIVERED", "CANCELLED"].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>
              {editOrders.length === 0 && <p className="p-5 text-sm text-muted">No edit orders yet.</p>}
            </div>
          )}

          {tab === "payments" && (
            <div className="overflow-x-auto rounded-3xl glass border border-fg/10" data-lenis-prevent>
              <table className="w-full min-w-[720px] text-sm"><thead><tr className="text-xs text-muted border-b border-fg/10">{["When", "Ref", "Kind", "Provider", "Amount", "Status"].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr></thead>
              <tbody>{payments.map((p: any) => <tr key={p.id} className="border-b border-fg/5 last:border-0"><td className="px-4 py-3 text-xs">{format(new Date(p.createdAt), "d MMM h:mm a")}</td><td className="px-4 py-3 font-display font-semibold">{p.ref}</td><td className="px-4 py-3">{p.kind}</td><td className="px-4 py-3 text-xs">{p.provider}<br /><span className="text-muted">{p.orderId}</span></td><td className="px-4 py-3">{inr(p.amount)}</td><td className="px-4 py-3"><span className={cn("text-xs font-semibold", p.status === "PAID" ? "text-cyan" : p.status === "REFUNDED" ? "text-orange" : "text-muted")}>{p.status}{p.refundAmount ? ` (₹${p.refundAmount})` : ""}</span></td></tr>)}</tbody></table>
            </div>
          )}

          {tab === "quick" && (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{quick.map((x: any) => <div key={x.id} className={cn("glass rounded-3xl p-4 border", x.status === "NEW" ? "gradient-border" : "border-fg/10")}><div className="flex justify-between"><p className="font-semibold">{x.occasion} · {x.city}</p><span className="text-xs text-muted">{format(new Date(x.createdAt), "d MMM h:mm a")}</span></div><p className="text-sm text-muted mt-1">{format(new Date(x.date), "EEE d MMM")} · {x.budget}</p><a href={`tel:+91${x.phone}`} className="mt-2 inline-block font-display text-lg font-semibold">+91 {x.phone}</a><div className="mt-3 flex gap-2">{["CALLED", "CONVERTED", "LOST"].map((s) => <button key={s} onClick={() => call("/api/admin/quick", { id: x.id, status: s }, "Updated")} className={cn("rounded-full px-3 py-1.5 text-xs border", x.status === s ? "bg-brand text-white border-transparent" : "border-fg/15")}>{s}</button>)}</div></div>)}{quick.length === 0 && <p className="text-sm text-muted">No quick requests yet.</p>}</div>
          )}

          {tab === "coupons" && (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <div className="glass rounded-3xl p-5 border border-fg/10 space-y-3"><p className="font-display text-lg font-semibold">New coupon</p><input className={inp + " w-full uppercase"} placeholder="CODE" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} /><div className="grid grid-cols-2 gap-2"><select className={inp} value={coupon.type} onChange={(e) => setCoupon({ ...coupon, type: e.target.value })}><option>FLAT</option><option>PERCENT</option></select><input type="number" className={inp} value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: Number(e.target.value) })} placeholder="Value" /></div><div className="grid grid-cols-2 gap-2"><input type="number" className={inp} value={coupon.minAmount} onChange={(e) => setCoupon({ ...coupon, minAmount: Number(e.target.value) })} placeholder="Min order" /><input type="number" className={inp} value={coupon.maxUses} onChange={(e) => setCoupon({ ...coupon, maxUses: e.target.value })} placeholder="Max uses" /></div><button onClick={() => call("/api/admin/coupons", { method: "POST", ...coupon }, "Coupon saved")} className="h-10 w-full rounded-full bg-brand text-white text-sm font-semibold">Save coupon</button></div>
              <div className="glass rounded-3xl border border-fg/10 overflow-hidden">{coupons.map((c: any) => <div key={c.id} className="flex items-center justify-between px-5 py-3 border-b border-fg/5 last:border-0 text-sm"><div><p className="font-display font-semibold">{c.code}</p><p className="text-xs text-muted">{c.type === "FLAT" ? inr(c.value) : c.value + "%"} off · min {inr(c.minAmount)} · used {c.used}{c.maxUses ? `/${c.maxUses}` : ""}</p></div><button onClick={() => call("/api/admin/coupons", { id: c.id, active: !c.active }, c.active ? "Deactivated" : "Activated")} className={cn("rounded-full px-3 py-1 text-xs font-semibold", c.active ? "bg-cyan/20 text-cyan" : "bg-fg/10 text-muted")}>{c.active ? "Active" : "Off"}</button></div>)}</div>
            </div>
          )}

          {tab === "cities" && (
            <div className="grid gap-3 md:grid-cols-3">{cities.map((c: any) => <div key={c.slug} className="glass rounded-3xl p-5 border border-fg/10"><div className="flex justify-between"><p className="font-display text-lg font-semibold">{c.name}</p><span className={cn("text-xs font-semibold", c.live ? "text-cyan" : "text-orange")}>{c.live ? "LIVE" : "SOON"}</span></div><p className="text-sm text-muted mt-1">{c.reelers} reelers · {c.bookings} bookings · {c.waitlist} on waitlist</p><p className="text-xs text-muted mt-2">{c.areas.join(" · ") || "No areas yet"}</p></div>)}</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
