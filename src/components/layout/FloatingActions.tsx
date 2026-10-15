"use client";
import { motion } from "framer-motion";
import { MessageCircle, Zap } from "lucide-react";
import Link from "next/link";
import { waLink } from "@/lib/utils";
import { useUI } from "@/store/ui";

export default function FloatingActions() {
  const setQuickBook = useUI((s) => s.setQuickBook);
  return (
    <>
      <motion.a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" data-cursor="Chat"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, type: "spring" }}
        className="fixed bottom-24 right-4 z-[90] hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg md:bottom-6">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
        <MessageCircle size={24} className="relative" />
      </motion.a>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1, type: "spring", stiffness: 200, damping: 25 }} className="fixed inset-x-3 bottom-3 z-[90] md:hidden">
        <div className="glass rounded-full p-1.5 flex gap-1.5 shadow-card">
          <button onClick={() => setQuickBook(true)} className="flex-1 h-12 rounded-full bg-brand text-white font-semibold text-sm flex items-center justify-center gap-2"><Zap size={16} /> Book Now</button>
          <Link href={waLink()} target="_blank" className="h-12 px-5 rounded-full bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2"><MessageCircle size={16} /> WhatsApp</Link>
        </div>
      </motion.div>
    </>
  );
}
