import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireReeler } from "@/lib/reeler-auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const r = await requireReeler();
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });
  const { action, deliverables } = await req.json().catch(() => ({}));
  const b = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!b || b.reelerId !== r.reeler.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "accept") { await prisma.booking.update({ where: { id: b.id }, data: { acceptance: "ACCEPTED", events: { create: { type: "ACCEPTED", note: `${r.reeler.displayName} accepted the shoot` } } } }); }
  else if (action === "decline") { await prisma.booking.update({ where: { id: b.id }, data: { acceptance: "DECLINED", reelerId: null, autoAssign: true, status: "BOOKED", events: { create: { type: "DECLINED", note: "Reeler declined, reassigning" } } } }); await prisma.payout.deleteMany({ where: { bookingId: b.id } }); }
  else if (action === "shoot_done") { if (!["ASSIGNED"].includes(b.status)) return NextResponse.json({ error: "Booking not in shoot stage" }, { status: 400 }); const sla = new Date(Date.now() + 24 * 3600 * 1000); await prisma.booking.update({ where: { id: b.id }, data: { status: "EDITING", shootDoneAt: new Date(), slaDeadline: sla, events: { create: [{ type: "SHOOT_DONE", note: "Shoot wrapped, 24-hr clock started" }, { type: "EDITING", note: "Editing in progress" }] } } }); }
  else if (action === "delivered") {
    if (!["EDITING", "SHOOT_DONE"].includes(b.status)) return NextResponse.json({ error: "Not in editing stage" }, { status: 400 });
    const list = Array.isArray(deliverables) ? deliverables.filter((d: any) => typeof d?.url === "string" && d.url.startsWith("http")).slice(0, 30) : [];
    if (!list.length) return NextResponse.json({ error: "Add at least one reel link" }, { status: 400 });
    const late = !!(b.slaDeadline && Date.now() > b.slaDeadline.getTime());
    await prisma.booking.update({ where: { id: b.id }, data: { status: "DELIVERED", deliveredAt: new Date(), lateFlag: late, deliverables: JSON.stringify(list), events: { create: { type: "DELIVERED", note: late ? "Delivered (late, flagged to admin)" : "Delivered within 24 hrs" } } } });
    await prisma.reeler.update({ where: { id: r.reeler.id }, data: { delivered: { increment: list.length } } });
    if (b.reelerId && b.amountPaid >= b.total) await prisma.payout.upsert({ where: { bookingId: b.id }, update: {}, create: { reelerId: b.reelerId, bookingId: b.id, gross: b.total, commission: Math.round(b.total * 0.15), net: b.total - Math.round(b.total * 0.15) } });
  }
  else return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
