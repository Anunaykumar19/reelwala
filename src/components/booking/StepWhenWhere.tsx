"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { format, addDays } from "date-fns";
import { CalendarDays, Clock, MapPin, LocateFixed, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useBooking } from "@/store/booking";
import { CITIES, LIVE_CITIES } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false, loading: () => <div className="h-full w-full rounded-2xl skeleton" /> });
const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "19:00", "20:00", "21:00"];

export default function StepWhenWhere() {
  const b = useBooking();
  const city = CITIES.find((c) => c.name === b.city) || LIVE_CITIES[0];
  const quick = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1)), []);
  const valid = b.date && b.startTime && b.address.trim().length > 5;

  const locate = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => { b.set({ lat: coords.latitude, lng: coords.longitude }); toast.success("Pin dropped at your location"); }, () => toast.error("Location permission nahi mili"));
  };

  return (
    <div>
      <h2 className="font-display text-h2 font-semibold">Kab aur <span className="text-gradient">kahan?</span></h2>
      <p className="mt-2 text-muted">Date, time and the spot. Reeler reaches 15 min early.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5"><CalendarDays size={13} /> Date</label>
            <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1" data-lenis-prevent>
              {quick.map((d) => { const v = format(d, "yyyy-MM-dd"); const on = b.date === v; return (
                <button key={v} onClick={() => b.set({ date: v })} className={cn("shrink-0 rounded-2xl px-3 py-2 text-center border transition-all", on ? "bg-brand text-white border-transparent shadow-glow-sm" : "glass border-fg/10 hover:border-fg/30")}>
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">{format(d, "EEE")}</span><span className="block font-display text-lg font-semibold leading-tight">{format(d, "d")}</span><span className="block text-[10px] opacity-80">{format(d, "MMM")}</span>
                </button>); })}
            </div>
            <input type="date" value={b.date} min={format(new Date(), "yyyy-MM-dd")} onChange={(e) => b.set({ date: e.target.value })} className="mt-2 h-11 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5"><Clock size={13} /> Start time</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIMES.map((t) => <button key={t} onClick={() => b.set({ startTime: t })} className={cn("rounded-full px-3.5 py-2 text-sm border transition-all", b.startTime === t ? "bg-brand text-white border-transparent" : "border-fg/15 hover:border-fg/40")}>{format(new Date(`2000-01-01T${t}`), "h:mm a")}</button>)}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-muted">Duration</span>
              <div className="flex items-center rounded-full glass">
                <button onClick={() => b.set({ durationHrs: Math.max(1, b.durationHrs - 1) })} className="h-10 w-10 flex items-center justify-center"><Minus size={14} /></button>
                <span className="w-16 text-center font-display font-semibold">{b.durationHrs} hr{b.durationHrs > 1 ? "s" : ""}</span>
                <button onClick={() => b.set({ durationHrs: Math.min(12, b.durationHrs + 1) })} className="h-10 w-10 flex items-center justify-center"><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5"><MapPin size={13} /> Location</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select value={b.city} onChange={(e) => { const c = CITIES.find((x) => x.name === e.target.value)!; b.set({ city: c.name, area: "", lat: null, lng: null }); }} className="h-11 rounded-2xl bg-surface-2 border border-fg/10 px-3 text-sm outline-none focus:ring-2 focus:ring-pink/50">
                {CITIES.map((c) => <option key={c.slug} disabled={!c.live}>{c.name}{c.live ? "" : " (soon)"}</option>)}
              </select>
              <select value={b.area} onChange={(e) => b.set({ area: e.target.value })} className="h-11 rounded-2xl bg-surface-2 border border-fg/10 px-3 text-sm outline-none focus:ring-2 focus:ring-pink/50">
                <option value="">Area</option>{city.areas.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <textarea value={b.address} onChange={(e) => b.set({ address: e.target.value })} rows={2} placeholder="Flat / venue name, street, landmark" className="mt-2 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink/50 resize-none" />
          </div>
        </div>

        <div className="relative h-[300px] lg:h-auto lg:min-h-[420px]">
          <LocationPicker lat={b.lat} lng={b.lng} center={[city.lat, city.lng]} onPick={(lat, lng) => b.set({ lat, lng })} className="absolute inset-0 rounded-2xl overflow-hidden border border-fg/10" />
          <button onClick={locate} className="absolute right-3 top-3 z-[400] h-10 px-3 rounded-full glass text-xs font-semibold flex items-center gap-1.5"><LocateFixed size={14} className="text-cyan" /> Use my location</button>
          <p className="absolute left-3 bottom-3 z-[400] rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] text-white">{b.lat ? "Pin dropped. Drag to adjust." : "Tap the map to drop a pin (optional)"}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={b.back} className="text-sm text-muted hover:text-fg">← Back</button>
        <MagneticButton onClick={b.next} disabled={!valid}>Choose package →</MagneticButton>
      </div>
    </div>
  );
}
