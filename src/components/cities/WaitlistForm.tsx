"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import MagneticButton from "@/components/ui/MagneticButton";

export default function WaitlistForm({ city }: { city: string }) {
  const [phone, setPhone] = useState(""); const [done, setDone] = useState(false);
  const submit = async () => { if (!/^\d{10}$/.test(phone)) return toast.error("10-digit number daalo"); const r = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city, phone }) }); if (r.ok) { setDone(true); toast.success("You're on the list 🚀"); } };
  if (done) return <p className="font-display text-xl font-semibold text-gradient">Dhanyavaad! We&apos;ll WhatsApp you when {city} goes live.</p>;
  return <div className="flex gap-2 max-w-md"><div className="flex h-12 flex-1 items-center rounded-2xl bg-surface-2 border border-fg/10 focus-within:ring-2 focus-within:ring-pink/50"><span className="px-4 text-sm text-muted border-r border-fg/10">+91</span><input inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="WhatsApp number" className="h-full flex-1 bg-transparent px-4 text-sm outline-none" /></div><MagneticButton onClick={submit}>Join waitlist</MagneticButton></div>;
}
