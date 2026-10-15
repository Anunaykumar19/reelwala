import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json().catch(() => ({}));
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });
  const c = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase().trim() } });
  if (!c || !c.active) return NextResponse.json({ error: "Invalid coupon" }, { status: 404 });
  if (c.expiresAt && c.expiresAt < new Date()) return NextResponse.json({ error: "Coupon expired" }, { status: 410 });
  if (c.maxUses && c.used >= c.maxUses) return NextResponse.json({ error: "Coupon fully used" }, { status: 410 });
  if (subtotal && subtotal < c.minAmount) return NextResponse.json({ error: `Min order ₹${c.minAmount}` }, { status: 422 });
  return NextResponse.json({ coupon: { code: c.code, type: c.type, value: c.value, minAmount: c.minAmount } });
}
