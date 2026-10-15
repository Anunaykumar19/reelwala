"use client";
import Link from "next/link";
import { Send } from "lucide-react";

const Instagram = (p: any) => <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
const Youtube = (p: any) => <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 8.5s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C16.4 5.3 12 5.3 12 5.3s-4.4 0-7.2.2c-.4.1-1.2.1-2 .9C2.2 7 2 8.5 2 8.5S1.8 10.2 1.8 12v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.1c.8.8 1.8.8 2.2.9 1.6.2 7 .2 7 .2s4.4 0 7.2-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4V12c0-1.8-.2-3.5-.2-3.5z" /><path d="M10 15.5l5-3-5-3z" fill="currentColor" /></svg>;
const Twitter = (p: any) => <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...p}><path d="M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.3-7-6.1 7H1.4l7.9-9L1 2h7l4.8 6.4L18.2 2zm-1.2 18h1.9L7.1 3.9H5.1L17 20z" /></svg>;
import Logo from "./Logo";
import { CITIES } from "@/lib/data/cities";
import { VIDEOS } from "@/lib/data/videos";
import ReelCard from "@/components/reels/ReelCard";

const COLS = [
  { title: "Customers", links: [["Book a Reeler", "/book"], ["Quick Book", "/quick"], ["Edit-Only Service", "/edit"], ["Pricing", "/pricing"], ["Browse Reelers", "/reelers"]] },
  { title: "Reelers", links: [["Become a Reeler", "/reeler/join"], ["Reeler Login", "/login?role=reeler"], ["Earnings Calculator", "/reeler/join#calculator"], ["Community Guidelines", "/terms#reelers"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["FAQ", "/faq"], ["Blog", "/blog"]] },
  { title: "Legal", links: [["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund & Cancellation", "/refund-policy"]] },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-fg/10 pb-28 md:pb-10">
      <div className="blob -bottom-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 bg-purple/40" />
      <div className="container relative pt-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-muted">Aaspaas ka Reeler, 24 ghante me Reel. Verified local reel makers for every occasion.</p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Youtube, Twitter].map((I, i) => (
                <a key={i} href="#" aria-label="social" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted hover:text-fg hover:bg-fg/10 transition-colors"><I size={16} /></a>
              ))}
            </div>
            <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
              <input type="email" placeholder="Email for deals & trends" className="h-11 flex-1 rounded-full glass px-4 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-pink/50" />
              <button className="h-11 w-11 rounded-full bg-brand text-white flex items-center justify-center" aria-label="Subscribe"><Send size={15} /></button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.title}>
                <h4 className="font-display font-semibold mb-3">{c.title}</h4>
                <ul className="space-y-2">
                  {c.links.map(([l, h]) => <li key={h}><Link href={h} className="text-sm text-muted hover:text-fg transition-colors">{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink mb-3">@reelwala on Instagram</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[VIDEOS.party[0], VIDEOS.wedding[0], VIDEOS.cafe[0], VIDEOS.urban[1], VIDEOS.kids[0], VIDEOS.party[3]].map((v) => <ReelCard key={v} src={v} showControls={false} autoplay="inview" rounded="rounded-xl" />)}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
          <span className="font-semibold text-fg">Cities:</span>
          {CITIES.map((c) => <Link key={c.slug} href={`/cities/${c.slug}`} className="hover:text-fg">{c.name}{!c.live && <span className="ml-1 text-[10px] uppercase text-orange">soon</span>}</Link>)}
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-fg/10 pt-6 text-xs text-muted md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Reelwala Technologies Pvt. Ltd. Made with ❤️ in India.</p>
          <p>Shaadi ho ya birthday — reel toh banni chahiye.</p>
        </div>
      </div>
    </footer>
  );
}
