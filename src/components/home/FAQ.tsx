"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import { FAQS } from "@/lib/data/content";
import { cn, waLink } from "@/lib/utils";

export default function FAQ({ items = FAQS }: { items?: typeof FAQS }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-20 md:py-28">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading eyebrow="FAQ" title="Sawaal?" highlight="Jawaab." sub="Still confused? WhatsApp us, a human replies in minutes." />
          <MagneticButton href={waLink("Hi! I have a question about Reelwala.")} variant="glass" className="mt-6">Chat on WhatsApp</MagneticButton>
        </div>
        <div className="space-y-3">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={f.q} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={cn("rounded-3xl border transition-colors", isOpen ? "glass border-fg/15" : "border-fg/10 hover:border-fg/20")}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-display text-lg font-semibold">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn("h-8 w-8 shrink-0 rounded-full flex items-center justify-center", isOpen ? "bg-brand text-white" : "bg-fg/8")}><Plus size={16} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-muted leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
