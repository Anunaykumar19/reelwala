import Reveal from "./Reveal";
import GradientText from "./GradientText";
import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, highlight, sub, align = "left", className }: { eyebrow?: string; title: string; highlight?: string; sub?: string; align?: "left" | "center"; className?: string }) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-pink">{eyebrow}</p>}
      <h2 className="font-display text-h2 font-semibold">
        {title} {highlight && <GradientText>{highlight}</GradientText>}
      </h2>
      {sub && <p className="mt-4 text-base md:text-lg text-muted leading-relaxed">{sub}</p>}
    </Reveal>
  );
}
