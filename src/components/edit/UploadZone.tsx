"use client";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, FileVideo, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type UploadedFile = { id: string; name: string; size: number; progress: number; done: boolean; preview?: string };

export default function UploadZone({ files, onChange, max = 40 }: { files: UploadedFile[]; onChange: (f: UploadedFile[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const filesRef = useRef(files); filesRef.current = files;

  const add = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.type.startsWith("video/") || f.type.startsWith("image/")).slice(0, max - filesRef.current.length);
    if (!arr.length) return;
    const next: UploadedFile[] = arr.map((f) => ({ id: Math.random().toString(36).slice(2), name: f.name, size: f.size, progress: 0, done: false, preview: f.type.startsWith("video/") ? URL.createObjectURL(f) : undefined }));
    onChange([...filesRef.current, ...next]);
    // Simulated upload. TODO: swap for UploadThing/Cloudinary signed upload; keep the same progress callbacks.
    next.forEach((nf) => {
      const dur = 1200 + Math.min(4000, nf.size / 50000);
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(100, ((performance.now() - t0) / dur) * 100);
        onChange(filesRef.current.map((x) => (x.id === nf.id ? { ...x, progress: p, done: p >= 100 } : x)));
        if (p < 100) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, [max, onChange]);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
        onClick={() => input.current?.click()} data-cursor="Upload"
        className={cn("relative cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all", over ? "border-pink bg-pink/10 scale-[1.01]" : "border-fg/15 glass hover:border-pink/50")}
      >
        <input ref={input} type="file" multiple accept="video/*,image/*" className="hidden" onChange={(e) => e.target.files && add(e.target.files)} />
        <motion.div animate={{ y: over ? -6 : 0 }} className="mx-auto h-16 w-16 rounded-2xl bg-brand text-white flex items-center justify-center shadow-glow"><UploadCloud size={28} /></motion.div>
        <p className="mt-4 font-display text-xl font-semibold">Drop your clips here</p>
        <p className="text-sm text-muted mt-1">or tap to browse · MP4, MOV, HEIC · up to 2 GB total</p>
      </div>
      <AnimatePresence>
        {files.length > 0 && (
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
            {files.map((f) => (
              <motion.li key={f.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="glass rounded-2xl p-3 border border-fg/10 flex items-center gap-3">
                {f.preview ? <video src={f.preview} muted className="h-12 w-8 rounded-lg object-cover bg-black" /> : <span className="h-12 w-8 rounded-lg bg-fg/10 flex items-center justify-center"><FileVideo size={16} /></span>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-fg/10"><div className={cn("h-full rounded-full bg-brand bg-[length:200%_100%]", !f.done && "animate-shimmer")} style={{ width: `${f.progress}%` }} /></div>
                </div>
                <span className="text-xs text-muted w-14 text-right">{f.done ? <Check size={16} className="inline text-cyan" /> : Math.round(f.progress) + "%"}</span>
                <button onClick={() => onChange(files.filter((x) => x.id !== f.id))} className="h-8 w-8 rounded-full hover:bg-fg/10 flex items-center justify-center"><X size={14} /></button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
