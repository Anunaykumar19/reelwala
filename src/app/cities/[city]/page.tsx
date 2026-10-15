import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ReelerCard from "@/components/reels/ReelerCard";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import FAQ from "@/components/home/FAQ";
import WaitlistForm from "@/components/cities/WaitlistForm";
import { CITIES } from "@/lib/data/cities";
import { OCCASIONS } from "@/lib/data/occasions";
import { getAllReelers } from "@/lib/reelers-query";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return CITIES.map((c) => ({ city: c.slug })); }
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const c = CITIES.find((x) => x.slug === params.city); if (!c) return {};
  return { title: `Reel makers in ${c.name} — Book from ₹999`, description: `Book verified Instagram reel makers in ${c.name} for birthdays, weddings, parties and cafés. Shot today, edited reel in 24 hours.${c.live ? "" : " Launching soon, join the waitlist."}` };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const c = CITIES.find((x) => x.slug === params.city);
  if (!c) notFound();
  const reelers = c.live ? (await getAllReelers()).filter((r) => r.city === c.name) : [];
  const ld = { "@context": "https://schema.org", "@type": "Service", name: `Reel maker booking in ${c.name}`, provider: { "@type": "Organization", name: "Reelwala" }, areaServed: { "@type": "City", name: c.name }, offers: { "@type": "Offer", price: "999", priceCurrency: "INR" } };
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="blob -top-20 -left-20 h-[460px] w-[460px] bg-purple/50" />
      <section className="container">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">{c.live ? "Live now" : "Launching soon"} · {c.state}</p>
        <h1 className="mt-3 font-display text-hero font-bold">Reel makers in <span className="text-gradient">{c.name}</span></h1>
        <p className="mt-5 max-w-xl text-lg text-muted">{c.live ? `${reelers.length}+ verified Reelers across ${c.areas.slice(0, 4).join(", ")} and more. Birthday, shaadi, café launch, kuch bhi. Reel ready in 24 hours from ₹999.` : `Reelwala is coming to ${c.name}. Join the waitlist and get ₹200 off your first shoot when we launch.`}</p>
        <div className="mt-6">{c.live ? <div className="flex flex-wrap gap-3"><MagneticButton href={`/book?city=${encodeURIComponent(c.name)}`} glow>Book in {c.name}</MagneticButton><MagneticButton href={`/reelers?city=${encodeURIComponent(c.name)}`} variant="glass">Browse reelers</MagneticButton></div> : <WaitlistForm city={c.name} />}</div>
        {c.areas.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{c.areas.map((a) => <Link key={a} href={`/reelers?city=${encodeURIComponent(c.name)}`} className="rounded-full glass px-3 py-1.5 text-sm hover:bg-fg/10">📍 {a}</Link>)}</div>}
      </section>
      {c.live && <section className="container mt-16"><Reveal><h2 className="font-display text-h2 font-semibold">Top Reelers in {c.name}</h2></Reveal><div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{reelers.map((r) => <ReelerCard key={r.slug} r={r as any} />)}</div></section>}
      <section className="container mt-16"><Reveal><h2 className="font-display text-h2 font-semibold">Popular occasions in {c.name}</h2></Reveal><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{OCCASIONS.map((o) => <Link key={o.slug} href={c.live ? `/book?occasion=${o.slug}&city=${encodeURIComponent(c.name)}` : "#"} className="glass rounded-3xl p-4 text-center border border-fg/10 hover:border-pink/50 transition-colors"><span className="text-3xl">{o.emoji}</span><p className="mt-2 text-sm font-semibold">{o.name}</p></Link>)}</div></section>
      <FAQ items={[{ q: `Kya ${c.name} ke sabhi areas cover hote hain?`, a: c.live ? `Yes, all of ${c.name}. Areas beyond 25 km of the centre may carry actual travel cost, shown before you pay.` : `We launch in ${c.name} with the central areas first and expand within weeks. Join the waitlist to get notified.` }, { q: "Kitne time me reel milegi?", a: "Within 24 hours of the shoot ending. Same-day delivery available as an add-on." }, { q: "Reeler verified hote hain?", a: "Every Reeler submits ID proof and sample reels which our team reviews. Reviews only come from completed bookings." }]} />
    </PageShell>
  );
}
