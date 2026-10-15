import { Suspense } from "react";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata: Metadata = { title: "Book a Reeler", description: "Book a verified reel maker in 6 quick steps. Pay 30% token, reels in 24 hours." };

export default function BookPage() {
  return (
    <PageShell floating={false}>
      <div className="blob -top-20 right-0 h-[420px] w-[420px] bg-purple/50" />
      <Suspense fallback={null}><BookingFlow /></Suspense>
    </PageShell>
  );
}
