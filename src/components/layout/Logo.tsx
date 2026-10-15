import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 font-display font-bold tracking-tight", s, className)} aria-label="Reelwala home">
      <span className="relative inline-flex h-[1.25em] w-[1.25em] items-center justify-center rounded-[0.35em] bg-brand shadow-glow-sm">
        <svg viewBox="0 0 24 24" className="h-[60%] w-[60%] fill-white" aria-hidden><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" /></svg>
      </span>
      <span>Reel<span className="text-gradient">wala</span></span>
    </Link>
  );
}
