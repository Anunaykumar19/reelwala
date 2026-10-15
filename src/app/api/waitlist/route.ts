import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  const { city, phone, email } = await req.json().catch(() => ({}));
  if (!city || (!phone && !email)) return NextResponse.json({ error: "City and phone or email required" }, { status: 400 });
  await prisma.waitlist.create({ data: { city, phone: phone || null, email: email || null } });
  return NextResponse.json({ ok: true });
}
