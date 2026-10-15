"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUI } from "@/store/ui";
import QuickBookForm from "./QuickBookForm";

export default function QuickBookModal() {
  const open = useUI((s) => s.quickBookOpen);
  const setOpen = useUI((s) => s.setQuickBook);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[8000] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md p-0 md:p-6" onClick={() => setOpen(false)}>
          <motion.div initial={{ y: 80, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg rounded-t-4xl md:rounded-4xl bg-surface border border-fg/10 p-6 md:p-8 shadow-card max-h-[92dvh] overflow-y-auto" data-lenis-prevent>
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-4 h-9 w-9 rounded-full glass flex items-center justify-center"><X size={16} /></button>
            <QuickBookForm onDone={() => setOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
