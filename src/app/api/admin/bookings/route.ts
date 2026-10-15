import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { id, action, reelerId, status, note } = await req.json().catch(() => ({}));
  const b = await prisma.booking.findUnique({ where: { id } });
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (action === "assign") {
    const r = await prisma.reeler.findUnique({ where: { id: reelerId } });
    if (!r) return NextResponse.json({ error: "Reeler not found" }, { status: 404 });
    await prisma.booking.update({ where: { id }, data: { reelerId, autoAssign: false, acceptance: "PENDING", status: b.status === "BOOKED" ? "ASSIGNED" : b.status, events: { create: { type: "ASSIGNED", note: `${r.displayName} assigned by admin` } } } });
  } else if (action === "status") {
    const data: any = { status, events: { create: { type: status, note: note || `Status set to ${status} by admin` } } };
    if (status === "EDITING" && !b.slaDeadline) { data.shootDoneAt = new Date(); data.slaDeadline = new Date(Date.now() + 24 * 3600 * 1000); }
    if (status === "DELIVERED") data.deliveredAt = new Date();
    if (status === "REFUNDED") { await prisma.payment.updateMany({ where: { bookingId: id, status: "PAID" }, data: { status: "REFUNDED", refundAmount: b.amountPaid } }); }
    await prisma.booking.update({ where: { id }, data });
  } else return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
