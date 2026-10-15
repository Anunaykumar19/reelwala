import Marquee from "@/components/ui/Marquee";
import { OCCASIONS } from "@/lib/data/occasions";

const Tag = ({ emoji, label, alt }: { emoji: string; label: string; alt?: boolean }) => (
  <span className={`flex items-center gap-3 font-display text-3xl md:text-5xl font-semibold whitespace-nowrap ${alt ? "text-fg/15" : "text-gradient"}`}>
    <span className="text-2xl md:text-4xl">{emoji}</span>{label}<span className="mx-3 h-2 w-2 rounded-full bg-fg/30" />
  </span>
);

export default function OccasionMarquee() {
  return (
    <section className="relative py-10 md:py-14 -rotate-1 overflow-visible">
      <Marquee speed={40}>{OCCASIONS.map((o) => <Tag key={o.slug} emoji={o.emoji} label={o.hinglish} />)}</Marquee>
      <Marquee speed={48} reverse className="mt-4">{[...OCCASIONS].reverse().map((o) => <Tag key={o.slug} emoji={o.emoji} label={o.name} alt />)}</Marquee>
    </section>
  );
}
