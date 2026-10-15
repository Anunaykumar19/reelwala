"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, ChevronDown, Scissors } from "lucide-react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import GradientText from "@/components/ui/GradientText";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMedia";
import { VIDEOS } from "@/lib/data/videos";
import { useUI } from "@/store/ui";

const Hero3D = dynamic(() => import("@/components/three/Hero3D"), { ssr: false });
const HeroPhonesCSS = dynamic(() => import("@/components/three/HeroPhonesCSS"), { ssr: false });

const HERO_VIDEOS = [VIDEOS.party[0], VIDEOS.wedding[0], VIDEOS.cafe[0], VIDEOS.urban[1], VIDEOS.party[3]];

const ease = [0.22, 1, 0.36, 1] as const;
const Word = ({ children, i, className = "" }: { children: React.ReactNode; i: number; className?: string }) => (
  <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] mr-[0.22em]">
    <motion.span className={`inline-block ${className}`} initial={{ y: "110%", filter: "blur(10px)", opacity: 0 }} animate={{ y: 0, filter: "blur(0px)", opacity: 1 }} transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease }}>{children}</motion.span>
  </span>
);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useMediaQuery("(max-width: 1023px)");
  const reduced = usePrefersReducedMotion();
  const [lowEnd, setLowEnd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const setQuickBook = useUI((s) => s.setQuickBook);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setMounted(true);
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      const cores = navigator.hardwareConcurrency || 4;
      const mem = (navigator as any).deviceMemory || 4;
      setLowEnd(!gl || cores <= 2 || mem <= 2);
    } catch { setLowEnd(true); }
  }, []);

  const headline = ["Mehenga", "cameraman", "nahi,"];
  const headline2 = ["Reeler", "book", "karo."];

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* ambient blobs */}
      <div className="blob -top-32 -left-32 h-[520px] w-[520px] bg-purple animate-blob" />
      <div className="blob top-1/3 -right-40 h-[560px] w-[560px] bg-pink animate-blob [animation-delay:-6s]" />
      <div className="blob -bottom-40 left-1/3 h-[460px] w-[460px] bg-orange/70 animate-blob [animation-delay:-12s]" />

      {/* 3D stage */}
      <div className="absolute inset-x-0 bottom-0 h-[46svh] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[56%]">
        {mounted && (reduced || lowEnd ? <HeroPhonesCSS videos={HERO_VIDEOS} /> : <Hero3D videos={HERO_VIDEOS} mobile={mobile} scroll={scrollYProgress} />)}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <motion.div style={{ y: textY, opacity: textO }} className="container relative z-10 flex min-h-[100svh] flex-col justify-start pt-28 pb-[48svh] lg:justify-center lg:pt-24 lg:pb-24">
        <div className="max-w-2xl lg:max-w-[46%] xl:max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" /></span>
            Live in Delhi NCR · Mumbai · Jaipur
          </motion.div>

          <h1 className="mt-5 font-display text-hero font-bold">
            <span className="block">{headline.map((w, i) => <Word key={w} i={i}>{w}</Word>)}</span>
            <span className="block">{headline2.map((w, i) => <Word key={w} i={i + 3} className={i === 0 ? "text-gradient text-gradient-animate" : ""}>{w}</Word>)}</span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease }} className="mt-6 max-w-lg text-base md:text-lg text-muted leading-relaxed">
            Verified local reel makers for birthdays, weddings, parties, cafés & more. <span className="text-fg font-medium">Shot today, reel ready in 24 hours.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.9, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1, type: "spring", stiffness: 200, damping: 18 }} className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton href="/book" size="lg" glow>Book a Reeler <ArrowRight size={18} /></MagneticButton>
            <MagneticButton href="/reeler/join" size="lg" variant="glass">Become a Reeler</MagneticButton>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }} className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[12, 47, 59, 24].map((n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={n} src={`https://i.pravatar.cc/64?img=${n}`} alt="" className="h-7 w-7 rounded-full ring-2 ring-bg object-cover" />
                ))}
              </div>
              <span className="ml-3"><span className="text-fg font-semibold">500+</span> reels delivered</span>
            </div>
            <span className="flex items-center gap-1"><Star size={14} className="fill-orange text-orange" /><span className="text-fg font-semibold">4.9</span> rating</span>
            <span>Starting <GradientText className="font-semibold">₹999</GradientText></span>
          </motion.div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} onClick={() => setQuickBook(true)} className="mt-5 inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors group">
            <span className="h-7 w-7 rounded-full glass flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors"><Scissors size={12} /></span>
            Book in 60 seconds, no account needed <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-muted lg:flex">
        scroll <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ChevronDown size={14} /></motion.span>
      </motion.div>
      <Link href="/edit" className="sr-only">Edit only service</Link>
    </section>
  );
}
