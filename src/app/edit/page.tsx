import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import EditOrderFlow from "@/components/edit/EditOrderFlow";
import { BeforeAfter } from "@/components/home/EditSpotlight";
import Reveal from "@/components/ui/Reveal";
import { VIDEOS } from "@/lib/data/videos";

export const metadata: Metadata = { title: "Edit-Only Service — from ₹199/reel", description: "Upload your clips, pick a style, get an edited Instagram reel in 24 hours. Express 6-hour delivery available." };

export default function EditPage() {
  return (
    <PageShell floating={false}>
      <div className="blob top-0 -right-20 h-[460px] w-[460px] bg-cyan/40" />
      <section className="container grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center pb-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Edit-only</p>
          <h1 className="mt-3 font-display text-hero font-bold">Footage hai?<br /><span className="text-gradient">Edit hum kar denge.</span></h1>
          <p className="mt-5 max-w-lg text-lg text-muted">Upload clips from your phone, pick a vibe, and get a scroll-stopping reel from ₹199. Delivered in 24 hours, express in 6.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">{["No shoot needed", "Trending audio", "1 free revision", "Works from any city"].map((t) => <span key={t} className="rounded-full glass px-3 py-1.5">{t}</span>)}</div>
        </div>
        <Reveal className="mx-auto w-full max-w-[300px]"><BeforeAfter before={VIDEOS.kids[0]} after={VIDEOS.kids[0]} /></Reveal>
      </section>
      <section className="container pb-24"><EditOrderFlow /></section>
    </PageShell>
  );
}
