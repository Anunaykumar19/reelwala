"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBooking } from "@/store/booking";
import StepProgress from "./StepProgress";
import StepOccasion from "./StepOccasion";
import StepWhenWhere from "./StepWhenWhere";
import StepPackage from "./StepPackage";
import StepReeler from "./StepReeler";
import StepContact from "./StepContact";
import StepReview from "./StepReview";
import PriceCard from "./PriceCard";
import { OCCASIONS } from "@/lib/data/occasions";

const STEPS = [StepOccasion, StepWhenWhere, StepPackage, StepReeler, StepContact, StepReview];

export default function BookingFlow() {
  const b = useBooking();
  const sp = useSearchParams();

  useEffect(() => {
    if (!b.hydrated) return;
    const patch: any = {};
    const reeler = sp.get("reeler"), pkg = sp.get("package"), occ = sp.get("occasion"), city = sp.get("city");
    if (reeler) { patch.reelerSlug = reeler; patch.autoAssign = false; }
    if (pkg && ["starter", "party", "event"].includes(pkg)) patch.packageKey = pkg;
    if (occ) { const o = OCCASIONS.find((x) => x.slug === occ || x.name === occ); if (o) { patch.occasion = o.name; if (b.step === 0) patch.step = 1; } }
    if (city) patch.city = city;
    if (Object.keys(patch).length) b.set(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b.hydrated]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [b.step]);

  if (!b.hydrated) return <div className="container py-10"><div className="h-8 w-1/2 rounded-full skeleton" /><div className="mt-8 h-96 rounded-3xl skeleton" /></div>;
  const Step = STEPS[b.step];

  return (
    <div className="container pb-24">
      <div className="mx-auto max-w-5xl">
        <StepProgress step={b.step} onJump={(i) => b.set({ step: i })} />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div key={b.step} initial={{ opacity: 0, x: 40, filter: "blur(6px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -40, filter: "blur(6px)" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <Step />
              </motion.div>
            </AnimatePresence>
          </div>
          <aside className="hidden lg:block"><PriceCard /></aside>
        </div>
      </div>
    </div>
  );
}
