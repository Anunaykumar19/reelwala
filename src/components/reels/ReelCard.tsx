"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, VolumeX, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  className?: string;
  caption?: string;
  credit?: string;
  autoplay?: "always" | "hover" | "inview";
  onClick?: () => void;
  showControls?: boolean;
  rounded?: string;
};

export default function ReelCard({ src, className, caption, credit, autoplay = "inview", onClick, showControls = true, rounded = "rounded-2xl" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current, w = wrap.current;
    if (!v || !w || autoplay !== "inview") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }, { threshold: 0.35 });
    io.observe(w);
    return () => io.disconnect();
  }, [autoplay]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // SSR'd videos may finish loading before hydration attaches listeners
    if (v.readyState >= 2) setReady(true);
    else if (v.readyState >= 1 && v.paused) { try { v.currentTime = 0.05; } catch {} }
    if (autoplay === "always") v.play().catch(() => {});
  }, [autoplay]);

  const like = (e: React.MouseEvent) => { e.stopPropagation(); setLiked(true); setBurst((b) => b + 1); };

  return (
    <div
      ref={wrap}
      data-cursor={onClick ? "Play" : undefined}
      onClick={onClick}
      onDoubleClick={like}
      onMouseEnter={() => { if (autoplay === "hover") ref.current?.play().catch(() => {}); }}
      onMouseLeave={() => { if (autoplay === "hover") { ref.current?.pause(); } setMuted(true); }}
      className={cn("relative overflow-hidden aspect-reel bg-surface-2 group/reel select-none", rounded, onClick && "cursor-pointer", className)}
    >
      {!ready && <div className="absolute inset-0 skeleton" />}
      <video
        ref={ref}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => { const v = e.currentTarget; if (v.paused) { try { v.currentTime = 0.05; } catch {} } }}
        onLoadedData={() => setReady(true)}
        onSeeked={() => setReady(true)}
        className={cn("relative h-full w-full object-cover transition-[transform,opacity] duration-700 group-hover/reel:scale-105", ready ? "opacity-100" : "opacity-0")}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

      {/* heart burst */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.div key={burst} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart className="h-24 w-24 fill-pink text-pink drop-shadow-[0_0_30px_rgba(236,72,153,.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {showControls && (
        <>
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
            <button aria-label={muted ? "Unmute" : "Mute"} onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }} className="h-8 w-8 rounded-full glass flex items-center justify-center text-white/90 hover:text-white">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <motion.button whileTap={{ scale: 0.8 }} aria-label="Like" onClick={like} className="h-8 w-8 rounded-full glass flex items-center justify-center">
              <Heart size={14} className={cn("transition-colors", liked ? "fill-pink text-pink" : "text-white/90")} />
            </motion.button>
          </div>
          {onClick && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/reel:opacity-100 transition-opacity">
              <span className="h-12 w-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center"><Play size={18} className="fill-white text-white ml-0.5" /></span>
            </div>
          )}
        </>
      )}
      {(caption || credit) && (
        <div className="absolute inset-x-3 bottom-3 text-white">
          {caption && <p className="text-sm font-semibold leading-tight">{caption}</p>}
          {credit && <p className="text-[11px] text-white/70 mt-0.5">{credit}</p>}
        </div>
      )}
    </div>
  );
}
