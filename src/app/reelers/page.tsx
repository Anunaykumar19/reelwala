import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import BrowseView from "@/components/browse/BrowseView";
import { getAllReelers } from "@/lib/reelers-query";

export const metadata: Metadata = { title: "Browse Reelers", description: "Verified local reel makers in Delhi NCR, Mumbai and Jaipur. Filter by occasion, price, rating and availability." };
export const dynamic = "force-dynamic";

export default async function ReelersPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const reelers = await getAllReelers();
  return (
    <PageShell>
      <div className="blob -top-20 -left-20 h-[420px] w-[420px] bg-purple/50" />
      <BrowseView reelers={reelers} initialCity={searchParams.city} initialOccasion={searchParams.occasion} />
    </PageShell>
  );
}
