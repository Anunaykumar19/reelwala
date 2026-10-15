import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireReeler } from "@/lib/reeler-auth";

export async function POST(req: Request) {
  const r = await requireReeler();
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });
  const { url, caption, occasion } = await req.json().catch(() => ({}));
  if (!/^https?:\/\/.+/.test(url || "")) return NextResponse.json({ error: "Paste a valid video URL" }, { status: 400 });
  const count = await prisma.portfolioReel.count({ where: { reelerId: r.reeler.id } });
  const reel = await prisma.portfolioReel.create({ data: { reelerId: r.reeler.id, url, caption: caption || null, occasion: occasion || null, order: count } });
  return NextResponse.json({ reel });
}
export async function PATCH(req: Request) {
  const r = await requireReeler();
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });
  const { order } = await req.json().catch(() => ({}));
  if (!Array.isArray(order)) return NextResponse.json({ error: "order[] required" }, { status: 400 });
  await Promise.all(order.map((id: string, i: number) => prisma.portfolioReel.updateMany({ where: { id, reelerId: r.reeler.id }, data: { order: i } })));
  const first = await prisma.portfolioReel.findFirst({ where: { reelerId: r.reeler.id }, orderBy: { order: "asc" } });
  if (first) await prisma.reeler.update({ where: { id: r.reeler.id }, data: { coverReel: first.url } });
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const r = await requireReeler();
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });
  const { id } = await req.json().catch(() => ({}));
  await prisma.portfolioReel.deleteMany({ where: { id, reelerId: r.reeler.id } });
  return NextResponse.json({ ok: true });
}
