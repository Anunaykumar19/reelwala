"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, type PanInfo } from "framer-motion";
import { X, ChevronUp, ChevronDown, Heart, Share2, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/store/ui";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ReelViewer() {
  const { open, items, index } = useUI((s) => s.viewer);
  const close = useUI((s) => s.closeViewer);
  const setIndex = useUI((s) => s.setViewerIndex);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const y = useMotionValue(0);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const lenis = (window as any).__lenis; lenis?.stop();
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") setIndex(Math.min(items.length - 1, index + 1));
      if (e.key === "ArrowUp") setIndex(Math.max(0, index - 1));
    };
    window.addEventListener("keydown", key);
    return () => { lenis?.start(); document.body.style.overflow = ""; window.removeEventListener("keydown", key); };
  }, [open, index, items.length, close, setIndex]);

  useEffect(() => {
    vids.current.forEach((v, i) => { if (!v) return; if (i === index) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } });
  }, [index, open]);

  const onDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -80 || info.velocity.y < -500) setIndex(Math.min(items.length - 1, index + 1));
    else if (info.offset.y > 80 || info.velocity.y > 500) setIndex(Math.max(0, index - 1));
  };
  const cur = items[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9000] bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={close}>
          <button aria-label="Close" onClick={close} className="absolute right-4 top-4 z-10 h-11 w-11 rounded-full glass flex items-center justify-center text-white"><X size={20} /></button>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-6 gap-2 z-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIndex(Math.max(0, index - 1))} className="h-11 w-11 rounded-full glass text-white flex items-center justify-center"><ChevronUp size={18} /></button>
            <button onClick={() => setIndex(Math.min(items.length - 1, index + 1))} className="h-11 w-11 rounded-full glass text-white flex items-center justify-center"><ChevronDown size={18} /></button>
          </div>

          <motion.div
            className="relative h-[100dvh] w-full md:h-[86vh] md:w-auto md:aspect-reel overflow-hidden md:rounded-3xl bg-black"
            onClick={(e) => e.stopPropagation()}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.15} onDragEnd={onDragEnd} style={{ y }}
          >
            <motion.div animate={{ y: `-${index * 100}%` }} transition={{ type: "spring", stiffness: 260, damping: 30 }} className="h-full w-full">
              {items.map((it, i) => (
                <div key={i} className="relative h-full w-full">
                  <video ref={(el) => { vids.current[i] = el; }} src={it.src} muted={muted} loop playsInline crossOrigin="anonymous" preload={Math.abs(i - index) <= 1 ? "auto" : "none"} className="h-full w-full object-cover" onDoubleClick={() => setLiked((l) => ({ ...l, [i]: true }))} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                </div>
              ))}
            </motion.div>

            {/* side actions */}
            <div className="absolute right-3 bottom-28 md:bottom-24 flex flex-col items-center gap-4 text-white">
              <motion.button whileTap={{ scale: 0.8 }} onClick={() => setLiked((l) => ({ ...l, [index]: !l[index] }))} className="flex flex-col items-center gap-1">
                <span className="h-11 w-11 rounded-full glass flex items-center justify-center"><Heart size={20} className={liked[index] ? "fill-pink text-pink" : ""} /></span>
                <span className="text-[11px]">{liked[index] ? "1.2K" : "1.1K"}</span>
              </motion.button>
              <button onClick={() => setMuted((m) => !m)} className="h-11 w-11 rounded-full glass flex items-center justify-center">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
              <button onClick={() => navigator.share?.({ url: location.href, title: "Reelwala" }).catch(() => {})} className="h-11 w-11 rounded-full glass flex items-center justify-center"><Share2 size={18} /></button>
            </div>

            {/* bottom credit */}
            <div className="absolute inset-x-0 bottom-0 p-4 pb-safe text-white">
              {cur?.reelerName && (
                <Link href={`/reelers/${cur.reelerSlug}`} className="flex items-center gap-2 mb-3">
                  <span className="h-9 w-9 rounded-full bg-brand p-[2px]"><span className="block h-full w-full rounded-full bg-black/60" /></span>
                  <div><p className="text-sm font-semibold">{cur.reelerName}</p><p className="text-[11px] text-white/70">Shot & edited via Reelwala</p></div>
                </Link>
              )}
              {cur?.caption && <p className="text-sm text-white/90 mb-3">{cur.caption}</p>}
              <div className="flex items-center gap-3">
                {cur?.reelerSlug ? (
                  <MagneticButton href={`/book?reeler=${cur.reelerSlug}`} size="sm" className="flex-1">Book this Reeler</MagneticButton>
                ) : (
                  <MagneticButton href="/book" size="sm" className="flex-1">Book a Reeler</MagneticButton>
                )}
                <span className="text-xs text-white/60">{index + 1}/{items.length}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
