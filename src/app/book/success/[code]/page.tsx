import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import SuccessView from "@/components/booking/SuccessView";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/booking-utils";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ params }: { params: { code: string } }) {
  const b = await prisma.booking.findUnique({ where: { code: params.code }, include: { reeler: true, city: true } });
  if (!b) notFound();
  const booking = {
    code: b.code, status: b.status, occasion: b.occasion, date: b.date.toISOString(), startTime: b.startTime, durationHrs: b.durationHrs, address: b.address, city: b.city.name,
    packageKey: b.packageKey, addons: parseJSON(b.addons, []), total: b.total, amountPaid: b.amountPaid, amountDue: b.amountDue,
    reeler: b.reeler ? { name: b.reeler.displayName, avatar: b.reeler.avatar, area: b.reeler.area, responseTime: b.reeler.responseTime } : null,
  };
  return <PageShell floating={false}><SuccessView booking={booking} /></PageShell>;
}
