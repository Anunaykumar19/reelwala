"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/reelers", label: "Browse Reelers" },
  { href: "/edit", label: "Edit Only" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reeler/join", label: "Become a Reeler" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    h(); window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 md:px-6 md:pt-4">
        <div className={cn("mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full px-4 md:px-6 transition-all duration-500", scrolled ? "glass shadow-card" : "bg-transparent")}>
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={cn("rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-fg hover:bg-fg/5 transition-colors", path.startsWith(l.href) && "text-fg bg-fg/5")}>{l.label}</Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-muted hover:text-fg px-2">Login</Link>
            <MagneticButton href="/book" size="sm">Book a Reeler</MagneticButton>
          </div>
          <button className="md:hidden h-10 w-10 rounded-full glass flex items-center justify-center" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-x-3 top-20 z-[99] glass rounded-3xl p-4 md:hidden shadow-card">
            <nav className="flex flex-col">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={l.href} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-fg/5">{l.label}</Link>
                </motion.div>
              ))}
              <Link href="/login" className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-fg/5">Login / Signup</Link>
            </nav>
            <div className="mt-3 flex items-center justify-between px-2">
              <ThemeToggle />
              <MagneticButton href="/book" size="sm">Book a Reeler</MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
