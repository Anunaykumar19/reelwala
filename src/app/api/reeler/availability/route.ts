import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireReeler } from "@/lib/reeler-auth";

export async function POST(req: Request) {
  const r = await requireReeler();
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });
  const { date } = await req.json().catch(() => ({}));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return NextResponse.json({ error: "Bad date" }, { status: 400 });
  const d = new Date(date + "T00:00:00");
  const existing = await prisma.blockedDate.findUnique({ where: { reelerId_date: { reelerId: r.reeler.id, date: d } } });
  if (existing) { await prisma.blockedDate.delete({ where: { id: existing.id } }); return NextResponse.json({ blocked: false }); }
  await prisma.blockedDate.create({ data: { reelerId: r.reeler.id, date: d, reason: "Unavailable" } });
  return NextResponse.json({ blocked: true });
}
