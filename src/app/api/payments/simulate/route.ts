import { NextResponse } from "next/server";
import { razorpayConfigured } from "@/lib/razorpay";
import { markPaid } from "@/lib/payments";

// Dev-only fallback used when Razorpay keys are not configured.
export async function POST(req: Request) {
  if (razorpayConfigured() && process.env.NODE_ENV === "production") return NextResponse.json({ error: "Disabled" }, { status: 403 });
  const { orderId } = await req.json().catch(() => ({}));
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });
  await new Promise((r) => setTimeout(r, 900));
  await markPaid(orderId, "sim_pay_" + Date.now().toString(36));
  return NextResponse.json({ ok: true });
}
