"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Logo from "@/components/layout/Logo";
import { COMPARISON } from "@/lib/data/content";

const AnimCheck = ({ delay = 0 }: { delay?: number }) => (
  <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay, type: "spring", stiffness: 300, damping: 15 }} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan/20 text-cyan">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: delay + 0.15, duration: 0.4 }} />
    </svg>
  </motion.span>
);

export default function Comparison() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container">
        <SectionHeading eyebrow="Why Reelwala" title="Reelwala vs" highlight="traditional videographer" sub="Same event, same moments. Just made for the feed, delivered 10× faster, at a fraction of the cost." />
        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-4xl glass border border-fg/10">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] items-center border-b border-fg/10 bg-fg/[0.03] px-5 py-4 text-sm">
              <span className="text-muted">Feature</span>
              <span className="flex justify-center"><Logo size="sm" /></span>
              <span className="text-center text-muted">Cameraman</span>
            </div>
            {COMPARISON.map((row, i) => (
              <motion.div key={row.feature} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] items-center px-5 py-4 text-sm border-b border-fg/5 last:border-0 hover:bg-fg/[0.03] transition-colors">
                <span className="font-medium pr-3">{row.feature}</span>
                <span className="flex justify-center font-semibold">{typeof row.reelwala === "boolean" ? <AnimCheck delay={i * 0.05} /> : <span className="text-gradient font-display text-lg">{row.reelwala}</span>}</span>
                <span className="flex justify-center text-muted">{typeof row.others === "boolean" ? <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-fg/5 text-muted"><X size={14} /></span> : row.others}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
