import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
