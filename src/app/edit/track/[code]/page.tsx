import { notFound } from "next/navigation";
import { Check, Clock, Film, PackageCheck, Wand2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import MagneticButton from "@/components/ui/MagneticButton";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/booking-utils";
import { inr, waLink } from "@/lib/utils";
import { format } from "date-fns";

export const dynamic = "force-dynamic";
const STEPS = [["QUEUED", "Received", Check], ["EDITING", "Editing", Wand2], ["DELIVERED", "Delivered", PackageCheck]] as const;

export default async function TrackPage({ params }: { params: { code: string } }) {
  const o = await prisma.editOrder.findUnique({ where: { code: params.code } });
  if (!o) notFound();
  const files = parseJSON<{ name: string; size: number }[]>(o.files, []);
  const idx = Math.max(0, STEPS.findIndex(([k]) => k === o.status));
  return (
    <PageShell floating={false}>
      <div className="container pb-24 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Edit order</p>
        <h1 className="mt-2 font-display text-h1 font-bold">{o.status === "DELIVERED" ? "Reel ready! 🎬" : "Editing shuru. 🎬"}</h1>
        <p className="mt-2 text-muted">Order <span className="font-display font-semibold text-fg">{o.code}</span> · {o.reelCount} reel{o.reelCount > 1 ? "s" : ""} · {o.style} · {o.express ? "Express 6 hr" : "24 hr"}</p>
        <div className="mt-8 glass gradient-border rounded-3xl p-6">
          <div className="flex items-center justify-between"><p className="font-semibold flex items-center gap-2"><Clock size={16} className="text-cyan" /> Delivery by</p><p className="font-display text-xl font-semibold">{o.slaDeadline ? format(o.slaDeadline, "EEE d MMM, h:mm a") : "—"}</p></div>
          <ol className="mt-6 flex items-center">
            {STEPS.map(([k, t, I], i) => <li key={k} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-2 text-center"><span className={`h-10 w-10 rounded-full flex items-center justify-center ${i <= idx ? "bg-brand text-white shadow-glow-sm" : "bg-fg/10 text-muted"}`}><I size={16} /></span><span className="text-xs font-medium">{t}</span></div>
              {i < STEPS.length - 1 && <span className={`mx-2 h-0.5 flex-1 rounded-full ${i < idx ? "bg-brand" : "bg-fg/10"}`} />}
            </li>)}
          </ol>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-3xl p-5 border border-fg/10"><p className="text-xs uppercase tracking-wider text-muted">Clips</p><ul className="mt-2 space-y-1 text-sm">{files.slice(0, 8).map((f, i) => <li key={i} className="flex items-center gap-2 truncate"><Film size={14} className="text-pink shrink-0" />{f.name}</li>)}{files.length > 8 && <li className="text-muted">+{files.length - 8} more</li>}</ul></div>
          <div className="glass rounded-3xl p-5 border border-fg/10"><p className="text-xs uppercase tracking-wider text-muted">Paid</p><p className="mt-2 font-display text-3xl font-bold">{inr(o.total)}</p><p className="text-xs text-muted">Music: {o.musicVibe} · Captions: {o.captions ? "yes" : "no"}</p></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><MagneticButton href={waLink(`Hi! Checking on my edit order ${o.code}.`)} glow>WhatsApp support</MagneticButton><MagneticButton href="/dashboard" variant="glass">Open dashboard</MagneticButton></div>
      </div>
    </PageShell>
  );
}
