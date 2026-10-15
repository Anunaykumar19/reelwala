import { prisma } from "@/lib/db";

export const bookingCode = () => "RW-" + Math.random().toString(36).slice(2, 8).toUpperCase();

export function parseJSON<T>(s: string | null | undefined, fallback: T): T {
  try { return s ? (JSON.parse(s) as T) : fallback; } catch { return fallback; }
}

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); };

/** Reelers in a city free on the given date/time window (no blocked date, no overlapping booking). */
export async function availableReelers(citySlug: string, date: Date, startTime: string, durationHrs: number) {
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
  const reelers = await prisma.reeler.findMany({
    where: { status: "VERIFIED", city: { slug: citySlug } },
    include: { reels: { orderBy: { order: "asc" } }, packages: true, blockedDates: { where: { date: { gte: dayStart, lt: dayEnd } } }, bookings: { where: { date: { gte: dayStart, lt: dayEnd }, status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] } }, select: { startTime: true, durationHrs: true } } },
    orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
  });
  const s = toMin(startTime), e = s + durationHrs * 60;
  return reelers.filter((r) => r.blockedDates.length === 0 && !r.bookings.some((b) => { const bs = toMin(b.startTime), be = bs + b.durationHrs * 60; return s < be + 60 && bs < e + 60; }));
}

export function serializeReeler(r: any) {
  return {
    id: r.id, slug: r.slug, name: r.displayName, avatar: r.avatar, area: r.area, rating: r.rating, reviews: r.reviewCount, delivered: r.delivered,
    responseTime: r.responseTime, startingPrice: r.startingPrice, tags: parseJSON<string[]>(r.tags, []), styles: parseJSON<string[]>(r.styles, []),
    bio: r.bio, instagram: r.instagram, lat: r.lat, lng: r.lng, verified: r.status === "VERIFIED", city: r.city?.name, citySlug: r.city?.slug,
    reels: (r.reels || []).map((x: any) => x.url), packages: (r.packages || []).map((p: any) => ({ key: p.key, price: p.price, hours: p.hours, reels: p.reels })),
  };
}
