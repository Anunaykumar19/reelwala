"use client";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useUI } from "@/store/ui";

export default function ThemeToggle() {
  const theme = useUI((s) => s.theme);
  const setTheme = useUI((s) => s.setTheme);
  const dark = theme === "dark";
  return (
    <button aria-label="Toggle theme" onClick={() => setTheme(dark ? "light" : "dark")} className="relative h-9 w-16 rounded-full glass flex items-center px-1">
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`h-7 w-7 rounded-full bg-brand flex items-center justify-center text-white ${dark ? "" : "ml-auto"}`}>
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
    </button>
  );
}
