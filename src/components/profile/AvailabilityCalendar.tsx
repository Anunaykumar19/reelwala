"use client";
import { useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isBefore, startOfMonth, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AvailabilityCalendar({ blocked, value, onChange }: { blocked: string[]; value?: string; onChange?: (d: string) => void }) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const pad = getDay(startOfMonth(month));
  const today = startOfToday();
  return (
    <div className="glass rounded-3xl p-5 border border-fg/10">
      <div className="flex items-center justify-between">
        <button onClick={() => setMonth(addMonths(month, -1))} className="h-9 w-9 rounded-full glass flex items-center justify-center"><ChevronLeft size={16} /></button>
        <p className="font-display font-semibold">{format(month, "MMMM yyyy")}</p>
        <button onClick={() => setMonth(addMonths(month, 1))} className="h-9 w-9 rounded-full glass flex items-center justify-center"><ChevronRight size={16} /></button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-muted">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: pad }).map((_, i) => <span key={"p" + i} />)}
        {days.map((d) => {
          const k = format(d, "yyyy-MM-dd"); const past = isBefore(d, today); const busy = blocked.includes(k); const sel = value === k;
          return (
            <button key={k} disabled={past || busy} onClick={() => onChange?.(k)} className={cn("aspect-square rounded-xl text-sm transition-all", past ? "text-fg/20" : busy ? "bg-orange/15 text-orange line-through" : sel ? "bg-brand text-white shadow-glow-sm" : "hover:bg-fg/10")}>{format(d, "d")}</button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-[11px] text-muted"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange/60" /> Booked</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand" /> Selected</span></div>
    </div>
  );
}
