import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computePrice } from "@/lib/pricing";
import { bookingCode, availableReelers } from "@/lib/booking-utils";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/razorpay";
import { CITIES } from "@/lib/data/cities";
import { PACKAGES } from "@/lib/data/packages";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const required = ["occasion", "date", "startTime", "durationHrs", "city", "address", "packageKey", "contactName", "contactPhone", "paymentMode"];
  for (const k of required) if (!b[k]) return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  if (!/^\d{10}$/.test(b.contactPhone)) return NextResponse.json({ error: "Phone must be 10 digits" }, { status: 400 });
  const cityMeta = CITIES.find((c) => c.name === b.city);
  if (!cityMeta?.live) return NextResponse.json({ error: "City not live yet" }, { status: 400 });
  const city = await prisma.city.findUniqueOrThrow({ where: { slug: cityMeta.slug } });
  const date = new Date(b.date); date.setHours(0, 0, 0, 0);
  if (date < new Date(new Date().setHours(0, 0, 0, 0))) return NextResponse.json({ error: "Date is in the past" }, { status: 400 });

  // reeler + availability
  let reeler = null as null | { id: string; packages: { key: string; price: number }[] };
  if (b.reelerSlug && !b.autoAssign) {
    const free = await availableReelers(cityMeta.slug, date, b.startTime, Number(b.durationHrs));
    const hit = free.find((r) => r.slug === b.reelerSlug);
    if (!hit) return NextResponse.json({ error: "That reeler is no longer available for this slot. Pick another or let us assign." }, { status: 409 });
    reeler = { id: hit.id, packages: hit.packages };
  }
  const pkg = PACKAGES.find((p) => p.id === b.packageKey);
  if (!pkg) return NextResponse.json({ error: "Bad package" }, { status: 400 });
  const packagePrice = reeler?.packages.find((p) => p.key === pkg.id)?.price ?? pkg.price;

  // coupon (server-side re-validation)
  let coupon = null as any;
  if (b.couponCode) {
    const c = await prisma.coupon.findUnique({ where: { code: String(b.couponCode).toUpperCase() } });
    if (c && c.active && (!c.expiresAt || c.expiresAt > new Date()) && (!c.maxUses || c.used < c.maxUses)) coupon = { code: c.code, type: c.type, value: c.value, minAmount: c.minAmount };
  }
  const price = computePrice({ packageKey: pkg.id, packagePrice, addons: b.addons || {}, extraReels: Number(b.extraReels || 0), coupon, paymentMode: b.paymentMode });

  const user = await prisma.user.upsert({ where: { phone: b.contactPhone }, update: { name: b.contactName, email: b.contactEmail || undefined, }, create: { phone: b.contactPhone, name: b.contactName, email: b.contactEmail || null, referralCode: "RW" + Math.random().toString(36).slice(2, 7).toUpperCase() } });

  const booking = await prisma.booking.create({
    data: {
      code: bookingCode(), userId: user.id, reelerId: reeler?.id ?? null, autoAssign: !reeler, cityId: city.id, occasion: b.occasion, date,
      startTime: b.startTime, durationHrs: Number(b.durationHrs), address: b.address, area: b.area || null, lat: b.lat ?? null, lng: b.lng ?? null,
      packageKey: pkg.id, packagePrice, addons: JSON.stringify(price.addonLines), extraReels: Number(b.extraReels || 0), instructions: b.instructions || null,
      songRefs: b.songRefs || null, instagram: b.instagram || null, contactName: b.contactName, contactPhone: b.contactPhone, contactEmail: b.contactEmail || null,
      couponCode: coupon?.code ?? null, discount: price.discount, subtotal: price.subtotal, total: price.total, paymentMode: b.paymentMode, amountDue: price.total,
      events: { create: { type: "CREATED", note: "Booking created, awaiting payment" } },
    },
  });

  const kind = b.paymentMode === "TOKEN" ? "TOKEN" : "FULL";
  if (razorpayConfigured()) {
    const order = await createRazorpayOrder(price.payNow, booking.code, { bookingCode: booking.code, kind });
    await prisma.payment.create({ data: { bookingId: booking.id, provider: "razorpay", orderId: order.id, amount: price.payNow, kind, status: "CREATED" } });
    return NextResponse.json({ booking: { id: booking.id, code: booking.code }, payment: { provider: "razorpay", orderId: order.id, amount: price.payNow, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID, prefill: { name: b.contactName, contact: b.contactPhone, email: b.contactEmail || undefined } } });
  }
  const pay = await prisma.payment.create({ data: { bookingId: booking.id, provider: "simulated", orderId: "sim_" + booking.code, amount: price.payNow, kind, status: "CREATED" } });
  return NextResponse.json({ booking: { id: booking.id, code: booking.code }, payment: { provider: "simulated", orderId: pay.orderId, amount: price.payNow } });
}
