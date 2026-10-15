"use client";
import { create } from "zustand";

export type ReelItem = { src: string; reelerSlug?: string; reelerName?: string; caption?: string };

type UIState = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  city: string;
  setCity: (c: string) => void;
  viewer: { open: boolean; items: ReelItem[]; index: number };
  openViewer: (items: ReelItem[], index?: number) => void;
  closeViewer: () => void;
  setViewerIndex: (i: number) => void;
  quickBookOpen: boolean;
  setQuickBook: (v: boolean) => void;
  cursor: { label: string | null; hover: boolean };
  setCursor: (c: Partial<{ label: string | null; hover: boolean }>) => void;
};

export const useUI = create<UIState>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", theme === "light");
      try { localStorage.setItem("rw-theme", theme); } catch {}
    }
  },
  city: "Delhi NCR",
  setCity: (city) => set({ city }),
  viewer: { open: false, items: [], index: 0 },
  openViewer: (items, index = 0) => set({ viewer: { open: true, items, index } }),
  closeViewer: () => set((s) => ({ viewer: { ...s.viewer, open: false } })),
  setViewerIndex: (index) => set((s) => ({ viewer: { ...s.viewer, index } })),
  quickBookOpen: false,
  setQuickBook: (quickBookOpen) => set({ quickBookOpen }),
  cursor: { label: null, hover: false },
  setCursor: (c) => set((s) => ({ cursor: { ...s.cursor, ...c } })),
}));
