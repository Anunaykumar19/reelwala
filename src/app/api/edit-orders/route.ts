import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EDIT_PRICING } from "@/lib/data/packages";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.style || !b.reelCount || !b.contactName || !/^\d{10}$/.test(b.contactPhone || "") || !Array.isArray(b.files) || !b.files.length) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const reels = Math.max(1, Math.min(20, Number(b.reelCount)));
  const per = b.express ? EDIT_PRICING.expressPerReel : EDIT_PRICING.perReel;
  const gross = per * reels; const total = gross - (reels >= 5 ? Math.round(gross * 0.1) : 0);
  const user = await prisma.user.upsert({ where: { phone: b.contactPhone }, update: { name: b.contactName }, create: { phone: b.contactPhone, name: b.contactName, referralCode: "RW" + Math.random().toString(36).slice(2, 7).toUpperCase() } });
  const code = "ED-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const order = await prisma.editOrder.create({ data: { code, userId: user.id, style: b.style, musicVibe: b.musicVibe || "Trending audio", captions: !!b.captions, reelCount: reels, express: !!b.express, notes: b.notes || null, files: JSON.stringify(b.files.slice(0, 60)), total } });
  if (razorpayConfigured()) {
    const rz = await createRazorpayOrder(total, code, { editOrder: code });
    await prisma.payment.create({ data: { editOrderId: order.id, provider: "razorpay", orderId: rz.id, amount: total, kind: "EDIT" } });
    return NextResponse.json({ order: { code }, payment: { provider: "razorpay", orderId: rz.id, amount: total, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID } });
  }
  const pay = await prisma.payment.create({ data: { editOrderId: order.id, provider: "simulated", orderId: "sim_" + code, amount: total, kind: "EDIT" } });
  return NextResponse.json({ order: { code }, payment: { provider: "simulated", orderId: pay.orderId, amount: total } });
}
