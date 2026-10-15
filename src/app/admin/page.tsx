import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import AdminView from "@/components/admin/AdminView";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/booking-utils";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  const [bookings, reelers, editOrders, payments, quick, coupons, cities, waitlist] = await Promise.all([
    prisma.booking.findMany({ include: { reeler: true, city: true }, orderBy: { createdAt: "desc" }, take: 300 }),
    prisma.reeler.findMany({ include: { city: true, reels: { orderBy: { order: "asc" } } }, orderBy: { createdAt: "desc" } }),
    prisma.editOrder.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.payment.findMany({ include: { booking: true, editOrder: true }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.quickRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.coupon.findMany({ orderBy: { code: "asc" } }),
    prisma.city.findMany({ include: { _count: { select: { reelers: true, bookings: true } } }, orderBy: { name: "asc" } }),
    prisma.waitlist.groupBy({ by: ["city"], _count: true }),
  ]);
  const paid = payments.filter((p) => p.status === "PAID");
  const kpis = { revenue: paid.reduce((s, p) => s + p.amount, 0), commission: Math.round(paid.filter((p) => p.bookingId).reduce((s, p) => s + p.amount, 0) * 0.15), bookings: bookings.length, delivered: bookings.filter((b) => b.status === "DELIVERED").length, reelers: reelers.filter((r) => r.status === "VERIFIED").length, pendingReelers: reelers.filter((r) => r.status === "PENDING").length, edits: editOrders.length };
  return (
    <PageShell floating={false} footer={false}>
      <AdminView
        kpis={kpis}
        bookings={bookings.map((b) => ({ id: b.id, code: b.code, contactName: b.contactName, contactPhone: b.contactPhone, occasion: b.occasion, packageKey: b.packageKey, date: b.date.toISOString(), startTime: b.startTime, durationHrs: b.durationHrs, city: b.city.name, area: b.area, total: b.total, amountDue: b.amountDue, status: b.status, autoAssign: b.autoAssign, acceptance: b.acceptance, lateFlag: b.lateFlag, slaDeadline: b.slaDeadline?.toISOString() || null, reeler: b.reeler ? { id: b.reeler.id, name: b.reeler.displayName } : null }))}
        reelers={reelers.map((r) => ({ id: r.id, name: r.displayName, avatar: r.avatar, area: r.area, city: r.city.name, instagram: r.instagram, equipment: r.equipment, idDocUrl: r.idDocUrl, upiId: r.upiId, status: r.status, reels: r.reels.map((x) => x.url) }))}
        editOrders={editOrders.map((o) => ({ id: o.id, code: o.code, user: o.user.name, phone: o.user.phone, reelCount: o.reelCount, style: o.style, musicVibe: o.musicVibe, captions: o.captions, express: o.express, fileCount: parseJSON<any[]>(o.files, []).length, total: o.total, status: o.status, slaDeadline: o.slaDeadline?.toISOString() || null }))}
        payments={payments.map((p) => ({ id: p.id, ref: p.booking?.code || p.editOrder?.code || "—", kind: p.kind, provider: p.provider, orderId: p.orderId, amount: p.amount, status: p.status, refundAmount: p.refundAmount, createdAt: p.createdAt.toISOString() }))}
        quick={quick.map((x) => ({ ...x, date: x.date.toISOString(), createdAt: x.createdAt.toISOString() }))}
        coupons={coupons}
        cities={cities.map((c) => ({ slug: c.slug, name: c.name, live: c.live, areas: parseJSON<string[]>(c.areas, []), reelers: c._count.reelers, bookings: c._count.bookings, waitlist: waitlist.find((w) => w.city === c.name)?._count || 0 }))}
      />
    </PageShell>
  );
}
