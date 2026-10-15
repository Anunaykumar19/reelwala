"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddonSel, CouponInfo } from "@/lib/pricing";

export type BookingDraft = {
  step: number;
  occasion: string;
  date: string;
  startTime: string;
  durationHrs: number;
  city: string;
  area: string;
  address: string;
  lat: number | null;
  lng: number | null;
  packageKey: "starter" | "party" | "event";
  addons: AddonSel;
  extraReels: number;
  reelerSlug: string | null;
  autoAssign: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  instagram: string;
  instructions: string;
  songRefs: string;
  coupon: CouponInfo;
  paymentMode: "TOKEN" | "FULL";
};

const initial: BookingDraft = {
  step: 0, occasion: "", date: "", startTime: "18:00", durationHrs: 3, city: "Delhi NCR", area: "", address: "", lat: null, lng: null,
  packageKey: "party", addons: {}, extraReels: 0, reelerSlug: null, autoAssign: false,
  contactName: "", contactPhone: "", contactEmail: "", instagram: "", instructions: "", songRefs: "", coupon: null, paymentMode: "TOKEN",
};

type S = BookingDraft & { set: (p: Partial<BookingDraft>) => void; next: () => void; back: () => void; reset: () => void; hydrated: boolean; setHydrated: () => void };

export const useBooking = create<S>()(
  persist(
    (set) => ({
      ...initial,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      set: (p) => set(p),
      next: () => set((s) => ({ step: Math.min(5, s.step + 1) })),
      back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
      reset: () => set({ ...initial }),
    }),
    { name: "rw-booking", partialize: (s) => { const { set: _s, next: _n, back: _b, reset: _r, hydrated: _h, setHydrated: _sh, ...rest } = s; return rest; }, onRehydrateStorage: () => (state) => state?.setHydrated() },
  ),
);
