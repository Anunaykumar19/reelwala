"use client";
import { useEffect } from "react";
import { useUI } from "@/store/ui";

export default function ThemeInit() {
  const setTheme = useUI((s) => s.setTheme);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rw-theme") as "dark" | "light" | null;
      if (saved) setTheme(saved);
    } catch {}
  }, [setTheme]);
  return null;
}
