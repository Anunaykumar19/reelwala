import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.occasion || !body?.date || !body?.city || !/^\d{10}$/.test(body?.phone || "")) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  // TODO: persist with Prisma + notify ops via WhatsApp (Interakt/Twilio). Logged for now.
  console.log("[quick-book]", body);
  return NextResponse.json({ ok: true, id: "QB" + Date.now().toString(36).toUpperCase() });
}
