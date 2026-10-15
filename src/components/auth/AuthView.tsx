"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/layout/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { VIDEOS } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

const MONTAGE = [VIDEOS.party[0], VIDEOS.wedding[0], VIDEOS.cafe[0], VIDEOS.urban[1], VIDEOS.kids[0], VIDEOS.party[3]];

export default function AuthView({ mode, googleEnabled }: { mode: "login" | "signup"; googleEnabled: boolean }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "REELER">(sp.get("role") === "reeler" ? "REELER" : "CUSTOMER");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [dev, setDev] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [timer, setTimer] = useState(0);
  const callback = sp.get("callbackUrl") || (role === "REELER" ? "/reeler/dashboard" : "/dashboard");
  useEffect(() => { if (!timer) return; const t = setTimeout(() => setTimer(timer - 1), 1000); return () => clearTimeout(t); }, [timer]);

  const send = async () => {
    if (!/^\d{10}$/.test(phone)) return toast.error("10-digit number daalo");
    setBusy(true);
    let r: Response, d: any;
    try { r = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) }); d = await r.json().catch(() => ({})); } catch { setBusy(false); return toast.error("Network error, try again"); }
    setBusy(false);
    if (!r.ok) return toast.error(d.error || "Could not send OTP");
    setSent(true); setDev(d.dev ? d.hint || "code" : null); setTimer(30);
    toast.success(d.dev ? (d.hint ? "Dev mode: OTP is " + d.hint : "Enter the access code shared by Reelwala") : "OTP sent on WhatsApp/SMS");
  };
  const verify = async (c = code) => {
    if (c.length !== 6) return;
    setBusy(true);
    const r = await signIn("otp", { phone, code: c, role, name, redirect: false });
    setBusy(false);
    if (r?.error) return toast.error("Galat OTP. Try again.");
    toast.success("Welcome to Reelwala 🎬");
    router.push(callback); router.refresh();
  };

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden bg-surface">
        <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 opacity-80 [mask-image:linear-gradient(180deg,#000,transparent_120%)]">
          {MONTAGE.map((v, i) => <video key={v} src={v} muted loop autoPlay playsInline className={cn("h-full w-full object-cover rounded-2xl", i % 2 ? "translate-y-10" : "")} />)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="font-display text-4xl font-bold leading-tight">Shaadi ho ya birthday,<br /><span className="text-gradient">reel toh banni chahiye.</span></p>
          <p className="mt-3 text-muted">500+ reels delivered · 4.9★ · 3 cities</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 md:px-16">
        <Logo />
        <h1 className="mt-8 font-display text-h2 font-semibold">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-muted">{mode === "signup" ? "30 seconds. Phone number is enough." : "Login with your phone or Google."}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {([["CUSTOMER", User, "I want reels", "Book a reeler for my event"], ["REELER", Camera, "I'm a Reeler", "Shoot reels, earn money"]] as const).map(([k, I, t, d]) => (
            <motion.button key={k} whileTap={{ scale: 0.97 }} onClick={() => setRole(k)} className={cn("relative rounded-3xl p-4 text-left border transition-all", role === k ? "glass gradient-border shadow-glow" : "glass border-fg/10 hover:border-fg/30")}>
              <span className={cn("h-10 w-10 rounded-2xl flex items-center justify-center", role === k ? "bg-brand text-white" : "bg-fg/8 text-muted")}><I size={18} /></span>
              <p className="mt-3 font-display font-semibold">{t}</p><p className="text-xs text-muted">{d}</p>
              {role === k && <motion.span layoutId="role-dot" className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-cyan" />}
            </motion.button>
          ))}
        </div>

        {googleEnabled && (
          <>
            <button onClick={() => signIn("google", { callbackUrl: callback })} className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-fg text-bg font-semibold">
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6C12.3 13.2 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"/><path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.7-3.7-13.6-9l-7.8 6C6.5 42.6 14.6 48 24 48z"/></svg>
              Continue with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-fg/10" />or phone OTP<span className="h-px flex-1 bg-fg/10" /></div>
          </>
        )}

        <div className={cn("space-y-3", !googleEnabled && "mt-6")}>
          {mode === "signup" && !sent && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50" />}
          <div className="flex h-12 items-center rounded-2xl bg-surface-2 border border-fg/10 focus-within:ring-2 focus-within:ring-pink/50">
            <span className="px-4 text-sm text-muted border-r border-fg/10">+91</span>
            <input inputMode="numeric" maxLength={10} value={phone} disabled={sent} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="98765 43210" className="h-full flex-1 bg-transparent px-4 text-sm outline-none" />
            {sent && <button onClick={() => { setSent(false); setCode(""); }} className="px-4 text-xs text-pink">Change</button>}
          </div>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MagneticButton onClick={send} className="w-full" size="lg" glow disabled={busy}>{busy ? <Loader2 size={18} className="animate-spin" /> : <>Send OTP <ArrowRight size={16} /></>}</MagneticButton>
              </motion.div>
            ) : (
              <motion.div key="verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="flex justify-between gap-2">
                  {Array.from({ length: 6 }).map((_, i) => <span key={i} className={cn("h-14 flex-1 rounded-2xl border flex items-center justify-center font-display text-2xl font-semibold", code[i] ? "border-pink/60 bg-pink/10" : "border-fg/15 bg-surface-2")}>{code[i] || ""}</span>)}
                </div>
                <input autoFocus inputMode="numeric" maxLength={6} value={code} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setCode(v); if (v.length === 6) setTimeout(() => verify(v), 50); }} placeholder="Type the 6-digit OTP" className="h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-center text-sm tracking-[0.5em] outline-none focus:ring-2 focus:ring-pink/50" />
                {dev && <p className="rounded-2xl bg-cyan/10 border border-cyan/30 p-3 text-xs text-cyan flex items-center gap-2"><ShieldCheck size={14} /> {dev === "code" ? "Preview mode: enter the 6-digit access code shared by Reelwala." : <>Dev mode: no SMS provider configured, OTP is <b>{dev}</b>.</>}</p>}
                <MagneticButton onClick={() => verify()} className="w-full" size="lg" glow disabled={busy || code.length !== 6}>{busy ? <Loader2 size={18} className="animate-spin" /> : "Verify & continue"}</MagneticButton>
                <button onClick={send} disabled={timer > 0} className="w-full text-center text-xs text-muted disabled:opacity-50">{timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-8 text-xs text-muted">By continuing you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.</p>
        <p className="mt-3 text-sm text-muted">{mode === "signup" ? "Already have an account?" : "New here?"} <a href={mode === "signup" ? "/login" : "/signup"} className="text-pink font-semibold">{mode === "signup" ? "Login" : "Sign up"}</a></p>
      </div>
    </div>
  );
}
