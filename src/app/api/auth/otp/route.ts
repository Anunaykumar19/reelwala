import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { phone } = await req.json().catch(() => ({}));
  if (!/^\d{10}$/.test(phone || "")) return NextResponse.json({ error: "Enter a 10-digit number" }, { status: 400 });
  const r = await issueOtp(phone);
  return NextResponse.json({ ok: true, dev: r.dev, hint: r.dev && process.env.NODE_ENV !== "production" ? "123456" : null });
}
