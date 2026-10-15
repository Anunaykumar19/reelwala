import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/razorpay";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { action } = await req.json().catch(() => ({}));
  const b = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!b || b.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "cancel") {
    if (["DELIVERED", "CANCELLED", "REFUNDED", "SHOOT_DONE", "EDITING"].includes(b.status)) return NextResponse.json({ error: "Can't cancel at this stage" }, { status: 400 });
    const shootAt = new Date(b.date); const [h, m] = b.startTime.split(":").map(Number); shootAt.setHours(h, m || 0, 0, 0);
    const free = shootAt.getTime() - Date.now() > 24 * 3600 * 1000;
    const refund = free ? b.amountPaid : Math.max(0, b.amountPaid - Math.round(b.total * 0.3));
    await prisma.booking.update({ where: { id: b.id }, data: { status: refund > 0 ? "REFUNDED" : "CANCELLED", events: { create: { type: "CANCELLED", note: free ? `Free cancellation, ₹${refund} refund initiated` : `Cancelled within 24 hrs, token retained, ₹${refund} refund` } } } });
    if (refund > 0) await prisma.payment.updateMany({ where: { bookingId: b.id, status: "PAID" }, data: { status: "REFUNDED", refundAmount: refund } });
    return NextResponse.json({ ok: true, refund, free });
  }
  if (action === "revision") {
    if (b.status !== "DELIVERED") return NextResponse.json({ error: "Revision available after delivery" }, { status: 400 });
    if (b.revisionUsed) return NextResponse.json({ error: "Free revision already used. WhatsApp us for paid edits." }, { status: 400 });
    await prisma.booking.update({ where: { id: b.id }, data: { revisionUsed: true, status: "EDITING", events: { create: { type: "REVISION", note: "Free revision requested" } } } });
    return NextResponse.json({ ok: true });
  }
  if (action === "pay_balance") {
    if (b.amountDue <= 0) return NextResponse.json({ error: "Nothing due" }, { status: 400 });
    if (["CANCELLED", "REFUNDED", "PENDING_PAYMENT"].includes(b.status)) return NextResponse.json({ error: "Booking not payable" }, { status: 400 });
    const existing = await prisma.payment.findFirst({ where: { bookingId: b.id, kind: "BALANCE", status: "CREATED" } });
    if (razorpayConfigured()) {
      const order = existing?.provider === "razorpay" && existing.orderId ? { id: existing.orderId } : await createRazorpayOrder(b.amountDue, b.code + "-BAL", { bookingCode: b.code, kind: "BALANCE" });
      if (!existing) await prisma.payment.create({ data: { bookingId: b.id, provider: "razorpay", orderId: order.id, amount: b.amountDue, kind: "BALANCE" } });
      return NextResponse.json({ payment: { provider: "razorpay", orderId: order.id, amount: b.amountDue, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID, prefill: { name: b.contactName, contact: b.contactPhone } } });
    }
    const pay = existing || await prisma.payment.create({ data: { bookingId: b.id, provider: "simulated", orderId: "sim_bal_" + b.code, amount: b.amountDue, kind: "BALANCE" } });
    return NextResponse.json({ payment: { provider: "simulated", orderId: pay.orderId, amount: b.amountDue } });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
