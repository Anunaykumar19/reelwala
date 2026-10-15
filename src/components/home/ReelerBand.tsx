"use client";
import { motion } from "framer-motion";
import { ArrowRight, IndianRupee, Smartphone, Clock3 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

export default function ReelerBand() {
  return (
    <section className="relative py-10 md:py-16">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand p-8 md:p-14 text-white shadow-glow">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full border-[40px] border-white/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_50%)]" />
            <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 flex items-center gap-2"><Smartphone size={14} /> For creators</p>
                <h2 className="mt-3 font-display text-h2 font-bold">Phone se shoot karte ho?<br />Earn ₹15k–40k / month.</h2>
                <p className="mt-4 max-w-md text-white/85">Flexible hours, instant payouts, free editing training and a growing Instagram. You keep 85% of every booking.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton href="/reeler/join" variant="white" size="lg">Apply now <ArrowRight size={18} /></MagneticButton>
                  <MagneticButton href="/reeler/join#calculator" variant="glass" size="lg" className="text-white border-white/30">Earnings calculator</MagneticButton>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
                {[[IndianRupee, "₹1,274", "avg. per shoot"], [Clock3, "3.2 hrs", "avg. shoot time"], [Smartphone, "T+1 day", "payout speed"]].map(([I, v, l]: any, k) => (
                  <motion.div key={l} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.1 }} className="rounded-2xl bg-white/15 backdrop-blur p-4 border border-white/20">
                    <I size={18} className="text-white/80" /><p className="mt-2 font-display text-2xl font-bold">{v}</p><p className="text-xs text-white/75">{l}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
