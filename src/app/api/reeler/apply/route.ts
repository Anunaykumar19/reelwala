import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CITIES } from "@/lib/data/cities";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  for (const k of ["name", "phone", "city", "areas", "equipment", "reels", "instagram", "upiId"]) if (!b[k] || (Array.isArray(b[k]) && !b[k].length)) return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  if (!/^\d{10}$/.test(b.phone)) return NextResponse.json({ error: "Phone must be 10 digits" }, { status: 400 });
  const cityMeta = CITIES.find((c) => c.name === b.city);
  if (!cityMeta) return NextResponse.json({ error: "Unknown city" }, { status: 400 });
  const city = await prisma.city.findUniqueOrThrow({ where: { slug: cityMeta.slug } });
  const session = await auth();
  const user = session?.user ? await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }) : await prisma.user.upsert({ where: { phone: b.phone }, update: { name: b.name }, create: { phone: b.phone, name: b.name, role: "REELER", referralCode: "RW" + Math.random().toString(36).slice(2, 7).toUpperCase() } });
  if (await prisma.reeler.findUnique({ where: { userId: user.id } })) return NextResponse.json({ error: "You already have a reeler profile. Login to see status." }, { status: 409 });
  const base = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "reeler";
  let slug = base; let n = 1; while (await prisma.reeler.findUnique({ where: { slug } })) slug = `${base}-${++n}`;
  const reeler = await prisma.reeler.create({ data: { userId: user.id, slug, displayName: b.name, cityId: city.id, area: String(b.areas[0] || ""), instagram: b.instagram, tags: JSON.stringify(b.occasions || []), styles: JSON.stringify(b.styles || []), equipment: b.equipment, upiId: b.upiId, idDocUrl: b.idDoc || null, status: "PENDING", lat: cityMeta.lat, lng: cityMeta.lng, reels: { create: (b.reels as string[]).slice(0, 3).map((url, i) => ({ url, order: i, approved: false })) }, packages: { create: [{ key: "starter", price: 999, hours: 1, reels: 2 }, { key: "party", price: 1999, hours: 3, reels: 5 }, { key: "event", price: 4999, hours: 10, reels: 10 }] } } });
  if (user.role === "CUSTOMER") await prisma.user.update({ where: { id: user.id }, data: { role: "REELER" } });
  return NextResponse.json({ ok: true, slug: reeler.slug });
}
