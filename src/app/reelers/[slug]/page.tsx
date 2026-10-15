import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ProfileView from "@/components/profile/ProfileView";
import { getReelerBySlug } from "@/lib/reelers-query";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = await getReelerBySlug(params.slug);
  if (!r) return { title: "Reeler not found" };
  return { title: `${r.name} — Reel maker in ${r.area}, ${r.city}`, description: `${r.bio} Starting ${"₹" + r.startingPrice}. ${r.rating}★ from ${r.reviews} verified reviews. 24-hr delivery.` };
}

export default async function ReelerProfile({ params }: { params: { slug: string } }) {
  const r = await getReelerBySlug(params.slug);
  if (!r) notFound();
  const ld = { "@context": "https://schema.org", "@type": "LocalBusiness", name: r.name, image: r.avatar, address: { "@type": "PostalAddress", addressLocality: r.area, addressRegion: r.city, addressCountry: "IN" }, aggregateRating: { "@type": "AggregateRating", ratingValue: r.rating, reviewCount: r.reviews }, priceRange: `₹${r.startingPrice}+` };
  return (
    <PageShell floating={false}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="blob -top-10 right-0 h-[460px] w-[460px] bg-pink/40" />
      <ProfileView r={r} />
    </PageShell>
  );
}
