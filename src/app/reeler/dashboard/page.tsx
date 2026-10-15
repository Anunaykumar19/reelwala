import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ReelerDashboard from "@/components/dashboard/ReelerDashboard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/booking-utils";

export const metadata: Metadata = { title: "Reeler Dashboard" };
export const dynamic = "force-dynamic";

export default async function ReelerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?role=reeler&callbackUrl=/reeler/dashboard");
  const r = await prisma.reeler.findUnique({ where: { userId: session.user.id }, include: { city: true, reels: { orderBy: { order: "asc" } }, packages: true, blockedDates: true, payouts: { include: { booking: true }, orderBy: { createdAt: "desc" } }, reviews: { include: { user: true, booking: true }, orderBy: { createdAt: "desc" } }, bookings: { include: { events: true }, orderBy: { date: "asc" } } } });
  if (!r) redirect("/reeler/join");
  const reeler = { slug: r.slug, displayName: r.displayName, avatar: r.avatar, bio: r.bio, area: r.area, city: r.city.name, instagram: r.instagram, equipment: r.equipment, upiId: r.upiId, status: r.status, rating: r.rating, delivered: r.delivered, tags: parseJSON<string[]>(r.tags, []), styles: parseJSON<string[]>(r.styles, []), packages: r.packages.map((p) => ({ key: p.key, price: p.price })) };
  const bookings = r.bookings.map((b) => ({ id: b.id, code: b.code, occasion: b.occasion, packageKey: b.packageKey, date: b.date.toISOString(), startTime: b.startTime, durationHrs: b.durationHrs, address: b.address, area: b.area, city: r.city.name, total: b.total, status: b.status, acceptance: b.acceptance, contactName: b.contactName, instructions: b.instructions, slaDeadline: b.slaDeadline?.toISOString() || null, lateFlag: b.lateFlag, assignedAt: (b.events.find((e) => e.type === "ASSIGNED")?.createdAt || b.createdAt).toISOString() }));
  return (
    <PageShell floating={false}>
      <ReelerDashboard reeler={reeler} bookings={bookings} payouts={r.payouts.map((p) => ({ id: p.id, code: p.booking.code, gross: p.gross, net: p.net, status: p.status, createdAt: p.createdAt.toISOString() }))} reviews={r.reviews.map((x) => ({ id: x.id, name: x.user.name || "Customer", rating: x.rating, text: x.text, occasion: x.booking.occasion, at: x.createdAt.toISOString() }))} reels={r.reels.map((x) => ({ id: x.id, url: x.url }))} blocked={r.blockedDates.map((d) => d.date.toISOString().slice(0, 10))} />
    </PageShell>
  );
}
