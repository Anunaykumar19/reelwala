"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock3, GraduationCap, IndianRupee, AtSign as IG, Loader2, Smartphone, TrendingUp, Upload, Wallet, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import MagneticButton from "@/components/ui/MagneticButton";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import UploadZone, { type UploadedFile } from "@/components/edit/UploadZone";
import { CITIES, LIVE_CITIES } from "@/lib/data/cities";
import { OCCASIONS } from "@/lib/data/occasions";
import { VIDEOS } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

const STEPS = ["About you", "Where you shoot", "Your gear", "Sample reels", "Verification"];
const STYLES = ["cinematic", "trendy", "aesthetic", "fast-cut", "wedding", "urban"];
const inp = "h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50";
const SAMPLE = [VIDEOS.party[1], VIDEOS.wedding[2], VIDEOS.cafe[1]];

export default function JoinView({ loggedIn }: { loggedIn: boolean }) {
  const [shoots, setShoots] = useState(4);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", city: "Delhi NCR", areas: [] as string[], occasions: [] as string[], styles: [] as string[], equipment: "", instagram: "", reels: ["", "", ""], idDoc: "", upiId: "", agree: false });
  const [idFiles, setIdFiles] = useState<UploadedFile[]>([]);
  const city = CITIES.find((c) => c.name === f.city) || LIVE_CITIES[0];
  const monthly = shoots * 4 * 1274 * 0.85;
  const valid = [f.name.trim().length > 1 && /^\d{10}$/.test(f.phone), f.areas.length > 0 && f.occasions.length > 0, f.equipment.trim().length > 2 && f.instagram.trim().length > 1, f.reels.filter((r) => /^https?:\/\//.test(r)).length >= 3, idFiles.length > 0 && idFiles.every((x) => x.done) && f.upiId.includes("@") && f.agree][step];

  const submit = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/reeler/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, idDoc: idFiles[0]?.name }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true); confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 }, colors: ["#7C3AED", "#EC4899", "#F97316", "#22D3EE"] });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  const toggle = (k: "areas" | "occasions" | "styles", v: string) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });

  return (
    <div className="container pb-24">
      {/* hero + calculator */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Become a Reeler</p>
          <h1 className="mt-3 font-display text-hero font-bold">Phone se shoot karte ho?<br /><span className="text-gradient">Paise bhi kamao.</span></h1>
          <p className="mt-5 max-w-lg text-lg text-muted">Join 120+ verified Reelers. Flexible hours, instant payouts, free editing training, and a growing Instagram. You keep 85% of every booking.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md text-sm">
            {[[Clock3, "Flexible hours", "Weekend-heavy, you choose"], [Wallet, "T+1 payouts", "Straight to UPI"], [GraduationCap, "Free training", "Editing + client handling"], [TrendingUp, "Grow your IG", "We tag you on every reel"]].map(([I, t, d]: any) => <div key={t} className="glass rounded-2xl p-3 border border-fg/10 flex gap-3"><I size={18} className="text-pink shrink-0 mt-0.5" /><div><p className="font-semibold">{t}</p><p className="text-xs text-muted">{d}</p></div></div>)}
          </div>
        </div>
        <Reveal>
          <div id="calculator" className="glass gradient-border rounded-4xl p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink flex items-center gap-1"><IndianRupee size={12} /> Earnings calculator</p>
            <div className="mt-4 flex items-end justify-between"><p className="text-sm text-muted">Shoots per week</p><p className="font-display text-4xl font-bold">{shoots}</p></div>
            <input type="range" min={1} max={12} value={shoots} onChange={(e) => setShoots(Number(e.target.value))} className="mt-3 w-full accent-pink" />
            <div className="mt-6 rounded-3xl bg-brand p-5 text-white shadow-glow"><p className="text-xs uppercase tracking-wider text-white/80">Estimated monthly earnings</p><p className="mt-1 font-display text-5xl font-bold">₹<CountUp value={Math.round(monthly)} /></p><p className="mt-1 text-xs text-white/80">Based on avg. ₹1,274 per shoot, 85% payout, 4 weeks</p></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">{[["Top 10%", "₹42k+"], ["Average", "₹18k"], ["Part-time", "₹9k"]].map(([a, b]) => <div key={a} className="rounded-2xl bg-fg/5 p-3"><p className="text-muted">{a}</p><p className="font-display text-lg font-semibold">{b}</p></div>)}</div>
          </div>
        </Reveal>
      </section>

      <section className="mt-20 grid grid-cols-3 gap-3 max-w-2xl mx-auto">{SAMPLE.map((v) => <video key={v} src={v} muted loop autoPlay playsInline className="aspect-reel w-full rounded-2xl object-cover" />)}</section>

      {/* application */}
      <section id="apply" className="mt-20 mx-auto max-w-3xl">
        {done ? (
          <div className="glass gradient-border rounded-4xl p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="mx-auto h-20 w-20 rounded-full bg-brand text-white flex items-center justify-center shadow-glow"><Check size={36} /></motion.div>
            <h2 className="mt-5 font-display text-h2 font-semibold">Application <span className="text-gradient">received!</span></h2>
            <p className="mt-2 text-muted">Our team reviews your reels and ID within 1-2 working days. You&apos;ll get a WhatsApp when you&apos;re verified.</p>
            <div className="mt-6 flex justify-center gap-3"><MagneticButton href={loggedIn ? "/reeler/dashboard" : "/login?role=reeler"} glow>{loggedIn ? "Open dashboard" : "Login to track status"}</MagneticButton></div>
          </div>
        ) : (
          <div className="glass rounded-4xl p-6 md:p-8 border border-fg/10">
            <div className="flex items-center justify-between"><h2 className="font-display text-h3 font-semibold">Apply in 3 minutes</h2><span className="text-xs text-muted">Step {step + 1} of {STEPS.length}</span></div>
            <div className="mt-4 flex gap-1.5">{STEPS.map((s, i) => <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-brand" : "bg-fg/10")} />)}</div>
            <p className="mt-2 text-sm font-semibold">{STEPS[step]}</p>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="mt-6 space-y-4">
                {step === 0 && <><input className={inp} placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /><div className={inp + " flex items-center p-0"}><span className="px-4 text-sm text-muted border-r border-fg/10">+91</span><input inputMode="numeric" maxLength={10} className="h-full flex-1 bg-transparent px-4 text-sm outline-none" placeholder="WhatsApp number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })} /></div></>}
                {step === 1 && <>
                  <select value={f.city} onChange={(e) => setF({ ...f, city: e.target.value, areas: [] })} className={inp}>{CITIES.map((c) => <option key={c.slug}>{c.name}{c.live ? "" : " (waitlist)"}</option>)}</select>
                  {city.areas.length > 0 && <div><p className="text-xs text-muted mb-2">Areas you can serve</p><div className="flex flex-wrap gap-2">{city.areas.map((a) => <button key={a} onClick={() => toggle("areas", a)} className={cn("rounded-full px-3 py-1.5 text-sm border", f.areas.includes(a) ? "bg-brand text-white border-transparent" : "border-fg/15")}>{a}</button>)}</div></div>}
                  {city.areas.length === 0 && <input className={inp} placeholder="Your area / locality" onChange={(e) => setF({ ...f, areas: [e.target.value] })} />}
                  <div><p className="text-xs text-muted mb-2">Occasions you love shooting</p><div className="flex flex-wrap gap-2">{OCCASIONS.map((o) => <button key={o.slug} onClick={() => toggle("occasions", o.name.split(" /")[0])} className={cn("rounded-full px-3 py-1.5 text-sm border", f.occasions.includes(o.name.split(" /")[0]) ? "bg-brand text-white border-transparent" : "border-fg/15")}>{o.emoji} {o.name}</button>)}</div></div>
                  <div><p className="text-xs text-muted mb-2">Your style</p><div className="flex flex-wrap gap-2">{STYLES.map((s) => <button key={s} onClick={() => toggle("styles", s)} className={cn("rounded-full px-3 py-1.5 text-sm border capitalize", f.styles.includes(s) ? "bg-cyan/20 text-cyan border-cyan/40" : "border-fg/15")}>{s}</button>)}</div></div>
                </>}
                {step === 2 && <><div className={inp + " flex items-center p-0 pl-4"}><Smartphone size={16} className="text-muted mr-2" /><input className="h-full flex-1 bg-transparent text-sm outline-none" placeholder="Phone / camera, gimbal, mic (e.g. iPhone 15 Pro, DJI OM6)" value={f.equipment} onChange={(e) => setF({ ...f, equipment: e.target.value })} /></div><div className={inp + " flex items-center p-0 pl-4"}><IG size={16} className="text-muted mr-2" /><input className="h-full flex-1 bg-transparent text-sm outline-none" placeholder="@instagram handle" value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} /></div><p className="text-xs text-muted">We check your Instagram for consistency. 500+ followers helps but isn&apos;t required.</p></>}
                {step === 3 && <><p className="text-sm text-muted">Paste links to 3 of your best reels (Instagram, Drive, or direct video links). Uploads coming soon.</p>{f.reels.map((r, i) => <input key={i} className={inp} placeholder={`Reel ${i + 1} link`} value={r} onChange={(e) => { const reels = [...f.reels]; reels[i] = e.target.value; setF({ ...f, reels }); }} />)}</>}
                {step === 4 && <>
                  <p className="text-sm text-muted flex items-center gap-2"><Upload size={14} /> Upload Aadhaar / PAN / DL (front)</p>
                  <UploadZone files={idFiles} onChange={setIdFiles} max={1} />
                  <div className={inp + " flex items-center p-0 pl-4"}><Wallet size={16} className="text-muted mr-2" /><input className="h-full flex-1 bg-transparent text-sm outline-none" placeholder="UPI ID for payouts (name@upi)" value={f.upiId} onChange={(e) => setF({ ...f, upiId: e.target.value })} /></div>
                  <label className="flex items-start gap-3 text-sm text-muted"><input type="checkbox" checked={f.agree} onChange={(e) => setF({ ...f, agree: e.target.checked })} className="mt-1 accent-pink" />I agree to the <a href="/terms#reelers" className="underline text-fg">Reeler guidelines</a>: 24-hr delivery, no direct dealing with Reelwala clients, 15% platform fee.</label>
                </>}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="text-sm text-muted hover:text-fg disabled:opacity-30">← Back</button>
              {step < STEPS.length - 1 ? <MagneticButton onClick={() => setStep(step + 1)} disabled={!valid}>Next <ArrowRight size={16} /></MagneticButton> : <MagneticButton onClick={submit} disabled={!valid || busy} glow>{busy ? <Loader2 size={16} className="animate-spin" /> : <><BadgeCheck size={16} /> Submit for verification</>}</MagneticButton>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
