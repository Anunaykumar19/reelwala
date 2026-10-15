import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.occasion || !body?.date || !body?.city || !/^\d{10}$/.test(body?.phone || "")) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const q = await prisma.quickRequest.create({ data: { occasion: body.occasion, date: new Date(body.date), city: body.city, phone: body.phone, budget: body.budget || "Not sure" } });
  // TODO: notify ops on WhatsApp (Interakt/Twilio) once keys exist
  console.log("[quick-book]", q.id, q.city, q.occasion);
  return NextResponse.json({ ok: true, id: q.id });
}
