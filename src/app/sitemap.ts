import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/data/cities";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const reelers = await prisma.reeler.findMany({ where: { status: "VERIFIED" }, select: { slug: true, updatedAt: true } }).catch(() => []);
  return [
    ...["", "/reelers", "/book", "/quick", "/edit", "/pricing", "/reeler/join", "/about", "/contact", "/faq", "/terms", "/privacy", "/refund-policy"].map((p) => ({ url: base + p, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...CITIES.map((c) => ({ url: `${base}/cities/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...reelers.map((r) => ({ url: `${base}/reelers/${r.slug}`, lastModified: r.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
