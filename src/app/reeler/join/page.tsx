import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import JoinView from "@/components/reeler/JoinView";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Become a Reeler — Earn ₹15k–40k/month", description: "Shoot Instagram reels for events near you. Flexible hours, instant UPI payouts, free training. Apply in 3 minutes." };

export default async function JoinPage() {
  const session = await auth();
  return (
    <PageShell>
      <div className="blob -top-20 -right-20 h-[460px] w-[460px] bg-orange/50" />
      <JoinView loggedIn={!!session?.user} />
    </PageShell>
  );
}
