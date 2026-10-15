import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/booking-utils";

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const b = await prisma.booking.findUnique({ where: { code: params.code }, include: { reeler: { include: { city: true } }, city: true, payments: true, events: { orderBy: { createdAt: "asc" } } } });
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    booking: {
      code: b.code, status: b.status, occasion: b.occasion, date: b.date, startTime: b.startTime, durationHrs: b.durationHrs, address: b.address, city: b.city.name,
      packageKey: b.packageKey, packagePrice: b.packagePrice, addons: parseJSON(b.addons, []), discount: b.discount, subtotal: b.subtotal, total: b.total,
      amountPaid: b.amountPaid, amountDue: b.amountDue, paymentMode: b.paymentMode, contactName: b.contactName, contactPhone: b.contactPhone, autoAssign: b.autoAssign,
      reeler: b.reeler ? { slug: b.reeler.slug, name: b.reeler.displayName, avatar: b.reeler.avatar, area: b.reeler.area, responseTime: b.reeler.responseTime } : null,
      events: b.events.map((e) => ({ type: e.type, note: e.note, at: e.createdAt })), createdAt: b.createdAt,
    },
  });
}
