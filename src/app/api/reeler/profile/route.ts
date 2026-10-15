import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireReeler } from "@/lib/reeler-auth";

export async function PATCH(req: Request) {
  const r = await requireReeler();
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });
  const b = await req.json().catch(() => ({}));
  const data: any = {};
  for (const k of ["bio", "area", "instagram", "equipment", "upiId", "avatar"]) if (typeof b[k] === "string") data[k] = b[k].slice(0, 500);
  if (Array.isArray(b.tags)) data.tags = JSON.stringify(b.tags.slice(0, 8));
  if (Array.isArray(b.styles)) data.styles = JSON.stringify(b.styles.slice(0, 6));
  if (b.packages && typeof b.packages === "object") {
    const base: Record<string, number> = { starter: 999, party: 1999, event: 4999 };
    for (const key of Object.keys(base)) {
      const v = Number(b.packages[key]);
      if (!v) continue;
      const price = Math.round(Math.min(base[key] * 1.2, Math.max(base[key] * 0.8, v)));
      await prisma.reelerPackage.upsert({ where: { reelerId_key: { reelerId: r.reeler.id, key } }, update: { price }, create: { reelerId: r.reeler.id, key, price, hours: key === "starter" ? 1 : key === "party" ? 3 : 10, reels: key === "starter" ? 2 : key === "party" ? 5 : 10 } });
    }
    const starter = await prisma.reelerPackage.findUnique({ where: { reelerId_key: { reelerId: r.reeler.id, key: "starter" } } });
    if (starter) data.startingPrice = starter.price;
  }
  await prisma.reeler.update({ where: { id: r.reeler.id }, data });
  return NextResponse.json({ ok: true });
}
