import { prisma } from "@/lib/db";
import { COMMISSION } from "@/lib/data/packages";

/** Idempotently mark a payment as paid and advance the booking / edit order. */
export async function markPaid(orderId: string, paymentId: string, raw?: unknown, signature?: string) {
  const p = await prisma.payment.findUnique({ where: { orderId }, include: { booking: true, editOrder: true } });
  if (!p) throw new Error("Unknown order");
  if (p.status === "PAID") return p;
  const paid = await prisma.payment.update({ where: { id: p.id }, data: { status: "PAID", paymentId, signature: signature || null, raw: raw ? JSON.stringify(raw).slice(0, 4000) : null } });
  if (p.booking) {
    const amountPaid = p.booking.amountPaid + p.amount;
    const status = p.booking.status === "PENDING_PAYMENT" ? (p.booking.reelerId ? "ASSIGNED" : "BOOKED") : p.booking.status;
    await prisma.booking.update({ where: { id: p.booking.id }, data: { amountPaid, amountDue: Math.max(0, p.booking.total - amountPaid), status, events: { create: { type: "PAID", note: `${p.kind} payment of ₹${p.amount} received` } } } });
    if (p.booking.reelerId) await prisma.bookingEvent.create({ data: { bookingId: p.booking.id, type: "ASSIGNED", note: "Reeler confirmed for your shoot" } });
    if (p.booking.couponCode) await prisma.coupon.update({ where: { code: p.booking.couponCode }, data: { used: { increment: 1 } } }).catch(() => {});
    if (p.booking.reelerId && amountPaid >= p.booking.total) {
      const gross = p.booking.total, commission = Math.round(gross * COMMISSION);
      await prisma.payout.upsert({ where: { bookingId: p.booking.id }, update: {}, create: { reelerId: p.booking.reelerId, bookingId: p.booking.id, gross, commission, net: gross - commission } });
    }
  }
  if (p.editOrder) {
    const sla = new Date(); sla.setHours(sla.getHours() + (p.editOrder.express ? 6 : 24));
    await prisma.editOrder.update({ where: { id: p.editOrder.id }, data: { status: "QUEUED", slaDeadline: sla } });
  }
  return paid;
}
