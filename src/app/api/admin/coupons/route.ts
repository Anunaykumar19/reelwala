import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { code, type, value, minAmount, maxUses } = await req.json().catch(() => ({}));
  if (!code || !["FLAT", "PERCENT"].includes(type) || !value) return NextResponse.json({ error: "code, type, value required" }, { status: 400 });
  const c = await prisma.coupon.upsert({ where: { code: String(code).toUpperCase() }, update: { type, value: Number(value), minAmount: Number(minAmount || 0), maxUses: maxUses ? Number(maxUses) : null, active: true }, create: { code: String(code).toUpperCase(), type, value: Number(value), minAmount: Number(minAmount || 0), maxUses: maxUses ? Number(maxUses) : null } });
  return NextResponse.json({ coupon: c });
}
export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { id, active } = await req.json().catch(() => ({}));
  await prisma.coupon.update({ where: { id }, data: { active: !!active } });
  return NextResponse.json({ ok: true });
}
