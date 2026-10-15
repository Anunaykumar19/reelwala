import { prisma } from "@/lib/db";
import { parseJSON, serializeReeler } from "@/lib/booking-utils";

export type ReelerDTO = ReturnType<typeof serializeReeler> & { blocked: string[] };

export async function getAllReelers(): Promise<ReelerDTO[]> {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const rows = await prisma.reeler.findMany({ where: { status: "VERIFIED" }, include: { city: true, reels: { orderBy: { order: "asc" } }, packages: true, blockedDates: { where: { date: { gte: today } } }, bookings: { where: { date: { gte: today }, status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] } }, select: { date: true } } }, orderBy: [{ rating: "desc" }, { reviewCount: "desc" }] });
  return rows.map((r) => ({ ...serializeReeler(r), blocked: Array.from(new Set([...r.blockedDates.map((b) => b.date.toISOString().slice(0, 10)), ...r.bookings.map((b) => b.date.toISOString().slice(0, 10))])) }));
}

export async function getReelerBySlug(slug: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const r = await prisma.reeler.findUnique({ where: { slug }, include: { city: true, reels: { orderBy: { order: "asc" } }, packages: true, blockedDates: { where: { date: { gte: today } } }, bookings: { where: { date: { gte: today }, status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] } }, select: { date: true } }, reviews: { include: { user: true, booking: true }, orderBy: { createdAt: "desc" } } } });
  if (!r) return null;
  const avg = r.reviews.length ? r.reviews.reduce((s, x) => s + x.rating, 0) / r.reviews.length : r.rating;
  return {
    ...serializeReeler(r),
    rating: Math.round(avg * 10) / 10,
    reviews: r.reviewCount,
    equipment: r.equipment, joined: r.createdAt.toISOString(),
    blocked: Array.from(new Set([...r.blockedDates.map((b) => b.date.toISOString().slice(0, 10)), ...r.bookings.map((b) => b.date.toISOString().slice(0, 10))])),
    reviewList: r.reviews.map((x) => ({ id: x.id, name: x.user.name || "Customer", rating: x.rating, text: x.text, occasion: x.booking.occasion, at: x.createdAt.toISOString(), media: x.mediaUrl })),
    areas: parseJSON<string[]>(r.city.areas, []),
  };
}
