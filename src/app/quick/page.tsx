import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import QuickBookForm from "@/components/home/QuickBookForm";

export const metadata: Metadata = { title: "Quick Book — 60 seconds", description: "Tell us the occasion, date and city. We assign a reeler and call you in 15 minutes." };

export default function QuickPage() {
  return (
    <PageShell floating={false}>
      <div className="blob -top-10 -left-20 h-[420px] w-[420px] bg-pink/50" />
      <div className="container pb-24 grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Quick book</p>
          <h1 className="mt-3 font-display text-h1 font-bold">Book in <span className="text-gradient">60 seconds.</span></h1>
          <p className="mt-4 text-lg text-muted max-w-md">No account, no browsing. Tell us the basics, hum best Reeler assign karenge aur 15 minute me call karenge.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {["No payment until you confirm on call", "Reeler matched on occasion, rating and distance", "Free cancellation 24 hrs before shoot"].map((t) => <li key={t} className="flex items-center gap-3"><span className="h-6 w-6 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-xs">✓</span>{t}</li>)}
          </ul>
        </div>
        <div className="glass gradient-border rounded-4xl p-6 md:p-8"><QuickBookForm /></div>
      </div>
    </PageShell>
  );
}
