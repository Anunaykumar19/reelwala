import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/booking-utils";

export const metadata: Metadata = { title: "My Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (session.user.role === "REELER") redirect("/reeler/dashboard");
  if (session.user.role === "ADMIN") redirect("/admin");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { addresses: true, bookings: { include: { reeler: true, city: true, payments: true }, orderBy: { date: "desc" } }, editOrders: { include: { payments: true }, orderBy: { createdAt: "desc" } } } });
  if (!user) redirect("/login");
  const bookings = user.bookings.map((b) => ({ id: b.id, code: b.code, occasion: b.occasion, date: b.date.toISOString(), startTime: b.startTime, durationHrs: b.durationHrs, city: b.city.name, area: b.area, address: b.address, packageKey: b.packageKey, status: b.status, total: b.total, amountPaid: b.amountPaid, amountDue: b.amountDue, slaDeadline: b.slaDeadline?.toISOString() || null, revisionUsed: b.revisionUsed, deliverables: parseJSON(b.deliverables, []), reeler: b.reeler ? { slug: b.reeler.slug, name: b.reeler.displayName, avatar: b.reeler.avatar, area: b.reeler.area, responseTime: b.reeler.responseTime } : null }));
  const editOrders = user.editOrders.map((o) => ({ id: o.id, code: o.code, status: o.status, total: o.total, deliverables: parseJSON(o.deliverables, []), createdAt: o.createdAt.toISOString() }));
  const payments = [...user.bookings.flatMap((b) => b.payments.map((p) => ({ ...p, ref: b.code }))), ...user.editOrders.flatMap((o) => o.payments.map((p) => ({ ...p, ref: o.code })))].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((p) => ({ id: p.id, ref: p.ref, kind: p.kind, amount: p.amount, status: p.status, provider: p.provider, refundAmount: p.refundAmount, createdAt: p.createdAt.toISOString() }));
  return (
    <PageShell floating={false}>
      <CustomerDashboard user={{ name: user.name, phone: user.phone, email: user.email, credits: user.credits, referralCode: user.referralCode }} bookings={bookings} editOrders={editOrders} payments={payments} addresses={user.addresses} />
    </PageShell>
  );
}
