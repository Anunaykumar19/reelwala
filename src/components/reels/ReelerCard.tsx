"use client";
import Link from "next/link";
import { BadgeCheck, Star, Zap } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import ReelCard from "./ReelCard";
import Pill from "@/components/ui/Pill";
import { inr, cn } from "@/lib/utils";
import type { Reeler } from "@/lib/data/reelers";
import { useUI } from "@/store/ui";

export default function ReelerCard({ r, className }: { r: Reeler; className?: string }) {
  const openViewer = useUI((s) => s.openViewer);
  return (
    <TiltCard intensity={6} className={cn("rounded-3xl", className)}>
      <div className="glass gradient-border rounded-3xl p-3 h-full flex flex-col">
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {r.reels.slice(0, 3).map((src, i) => (
            <ReelCard key={src + i} src={src} autoplay="hover" showControls={false} rounded="rounded-xl" onClick={() => openViewer(r.reels.map((s) => ({ src: s, reelerSlug: r.slug, reelerName: r.name })), i)} />
          ))}
        </div>
        <div className="flex items-start gap-3 px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.avatar} alt={r.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-pink/60" loading="lazy" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-semibold text-[17px] truncate">{r.name}</h3>
              {r.verified && <BadgeCheck size={16} className="text-cyan shrink-0" />}
            </div>
            <p className="text-xs text-muted truncate">{r.area}, {r.city} · <Zap size={10} className="inline text-orange" /> replies {r.responseTime}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="flex items-center justify-end gap-1 text-sm font-semibold"><Star size={13} className="fill-orange text-orange" />{r.rating.toFixed(1)}</p>
            <p className="text-[11px] text-muted">{r.reviews} reviews</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3 px-1">
          {r.tags.slice(0, 3).map((t) => <Pill key={t}>{t}</Pill>)}
          <Pill tone="cyan">24-hr delivery</Pill>
        </div>
        <div className="mt-auto pt-4 px-1 flex items-center justify-between">
          <p className="text-sm text-muted">From <span className="font-display text-lg font-semibold text-fg">{inr(r.startingPrice)}</span></p>
          <Link href={`/reelers/${r.slug}`} data-cursor="Book" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow-sm hover:shadow-glow transition-shadow">View Profile</Link>
        </div>
      </div>
    </TiltCard>
  );
}
