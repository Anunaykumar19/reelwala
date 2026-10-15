"use client";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const v: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" },
  show: (d: number) => ({ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Reveal({ children, className, delay = 0, once = true, amount = 0.2 }: { children: React.ReactNode; className?: string; delay?: number; once?: boolean; amount?: number }) {
  return (
    <motion.div custom={delay} variants={v} initial="hidden" whileInView="show" viewport={{ once, amount }} className={cn(className)}>
      {children}
    </motion.div>
  );
}

export function WordReveal({ text, className, delay = 0, as: Tag = "h1" }: { text: string; className?: string; delay?: number; as?: any }) {
  const words = text.split(" ");
  return (
    <Tag className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="overflow-hidden inline-block pb-[0.08em] -mb-[0.08em] mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", filter: "blur(8px)", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
