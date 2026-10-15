"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, Minus, Plus, Zap, Clock, Captions } from "lucide-react";
import toast from "react-hot-toast";
import UploadZone, { type UploadedFile } from "./UploadZone";
import MagneticButton from "@/components/ui/MagneticButton";
import CountUp from "@/components/ui/CountUp";
import { EDIT_PRICING } from "@/lib/data/packages";
import { cn, inr } from "@/lib/utils";
import { useRazorpay } from "@/hooks/useRazorpay";

const STYLE_DESC: Record<string, string> = { Trending: "Fast cuts, viral audio", Cinematic: "Slow-mo, colour grade", Wedding: "Emotional, warm", "Fast-cut": "Beat-synced, punchy", Aesthetic: "Soft, pinterest-y", "Meme / Funny": "Captions, zooms, SFX" };
const inp = "h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50";

export function editPrice(reels: number, express: boolean) {
  const per = express ? EDIT_PRICING.expressPerReel : EDIT_PRICING.perReel;
  const gross = per * reels;
  const discount = reels >= 5 ? Math.round(gross * 0.1) : 0;
  return { per, gross, discount, total: gross - discount };
}

export default function EditOrderFlow() {
  const router = useRouter();
  const { open } = useRazorpay();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [style, setStyle] = useState("Trending");
  const [music, setMusic] = useState("Trending audio");
  const [captions, setCaptions] = useState(true);
  const [reels, setReels] = useState(1);
  const [express, setExpress] = useState(false);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const p = useMemo(() => editPrice(reels, express), [reels, express]);
  const ready = files.length > 0 && files.every((f) => f.done) && name.trim().length > 1 && /^\d{10}$/.test(phone);

  const pay = async () => {
    setPaying(true);
    try {
      const r = await fetch("/api/edit-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ style, musicVibe: music, captions, reelCount: reels, express, notes, contactName: name, contactPhone: phone, files: files.map((f) => ({ name: f.name, size: f.size })) }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not create order");
      const done = () => router.push(`/edit/track/${d.order.code}`);
      if (d.payment.provider === "razorpay") {
        await open({ keyId: d.payment.keyId, orderId: d.payment.orderId, amount: d.payment.amount, description: `Edit ${reels} reel(s) · ${d.order.code}`, prefill: { name, contact: phone },
          onSuccess: async (res) => { const v = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(res) }); if (v.ok) done(); else toast.error("Verification failed. WhatsApp us: " + d.order.code); }, onDismiss: () => setPaying(false) });
      } else {
        const s = await fetch("/api/payments/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: d.payment.orderId }) });
        if (!s.ok) throw new Error("Payment failed"); done();
      }
    } catch (e: any) { toast.error(e.message); setPaying(false); }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-10">
        <section>
          <h2 className="font-display text-h3 font-semibold">1. Upload footage</h2>
          <p className="text-sm text-muted mt-1">Phone clips, GoPro, anything. More clips = better reel.</p>
          <div className="mt-4"><UploadZone files={files} onChange={setFiles} /></div>
        </section>
        <section>
          <h2 className="font-display text-h3 font-semibold">2. Pick a style</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {EDIT_PRICING.styles.map((s) => <button key={s} onClick={() => setStyle(s)} className={cn("rounded-2xl p-4 text-left border transition-all", style === s ? "bg-brand text-white border-transparent shadow-glow-sm" : "glass border-fg/10 hover:border-fg/30")}><p className="font-semibold text-sm">{s}</p><p className={cn("text-xs mt-0.5", style === s ? "text-white/80" : "text-muted")}>{STYLE_DESC[s]}</p></button>)}
          </div>
        </section>
        <section>
          <h2 className="font-display text-h3 font-semibold">3. Music & captions</h2>
          <div className="mt-4 flex flex-wrap gap-2">{EDIT_PRICING.musicVibes.map((m) => <button key={m} onClick={() => setMusic(m)} className={cn("rounded-full px-3.5 py-2 text-sm border transition-all", music === m ? "bg-brand text-white border-transparent" : "border-fg/15 hover:border-fg/40")}>{m}</button>)}</div>
          <button onClick={() => setCaptions((c) => !c)} className={cn("mt-4 flex items-center gap-3 rounded-2xl p-4 border w-full text-left", captions ? "bg-cyan/10 border-cyan/40" : "glass border-fg/10")}><Captions size={18} className={captions ? "text-cyan" : "text-muted"} /><span className="flex-1"><span className="block text-sm font-semibold">Add text & captions</span><span className="block text-xs text-muted">Hook text, name tags, subtitles where it helps</span></span><span className={cn("h-6 w-11 rounded-full p-0.5", captions ? "bg-cyan" : "bg-fg/15")}><motion.span animate={{ x: captions ? 20 : 0 }} className="block h-5 w-5 rounded-full bg-white" /></span></button>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Reference reels, moments to highlight, text to add…" className={inp + " mt-3 h-auto py-3 resize-none"} />
        </section>
        <section>
          <h2 className="font-display text-h3 font-semibold">4. Reels & delivery</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-4 border border-fg/10 flex items-center justify-between"><div><p className="text-sm font-semibold">Number of reels</p><p className="text-xs text-muted">5+ reels get 10% off</p></div><div className="flex items-center rounded-full bg-fg/5"><button onClick={() => setReels(Math.max(1, reels - 1))} className="h-9 w-9 flex items-center justify-center"><Minus size={14} /></button><span className="w-8 text-center font-display font-semibold">{reels}</span><button onClick={() => setReels(Math.min(20, reels + 1))} className="h-9 w-9 flex items-center justify-center"><Plus size={14} /></button></div></div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setExpress(false)} className={cn("rounded-2xl p-3 border text-left", !express ? "bg-brand text-white border-transparent" : "glass border-fg/10")}><Clock size={16} /><p className="text-sm font-semibold mt-1">24 hr</p><p className="text-xs opacity-80">{inr(EDIT_PRICING.perReel)}/reel</p></button>
              <button onClick={() => setExpress(true)} className={cn("rounded-2xl p-3 border text-left", express ? "bg-brand text-white border-transparent" : "glass border-fg/10")}><Zap size={16} /><p className="text-sm font-semibold mt-1">Express 6 hr</p><p className="text-xs opacity-80">{inr(EDIT_PRICING.expressPerReel)}/reel</p></button>
            </div>
          </div>
        </section>
        <section>
          <h2 className="font-display text-h3 font-semibold">5. Contact</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <div className={inp + " flex items-center p-0"}><span className="px-4 text-sm text-muted border-r border-fg/10">+91</span><input inputMode="numeric" maxLength={10} className="h-full flex-1 bg-transparent px-4 text-sm outline-none" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="WhatsApp number" /></div>
          </div>
        </section>
      </div>

      <aside>
        <div className="glass gradient-border rounded-3xl p-5 sticky top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Instant quote</p>
          <p className="mt-3 font-display text-5xl font-bold">₹<CountUp value={p.total} /></p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">{reels} reel{reels > 1 ? "s" : ""} × {inr(p.per)}</span><span>{inr(p.gross)}</span></div>
            {p.discount > 0 && <div className="flex justify-between text-cyan"><span>Bulk 10% off</span><span>−{inr(p.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Style</span><span>{style}</span></div>
            <div className="flex justify-between"><span className="text-muted">Music</span><span>{music}</span></div>
            <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{express ? "6 hr express" : "24 hr"}</span></div>
            <div className="flex justify-between"><span className="text-muted">Clips</span><span>{files.length} uploaded</span></div>
          </div>
          <MagneticButton onClick={pay} disabled={!ready || paying} className="mt-5 w-full" glow>{paying ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <><Lock size={14} /> Pay {inr(p.total)}</>}</MagneticButton>
          <p className="mt-3 text-[11px] text-muted text-center">{files.length === 0 ? "Upload at least one clip to continue" : !ready ? "Add your name and 10-digit number" : "Secure payment via Razorpay"}</p>
        </div>
      </aside>
    </div>
  );
}
