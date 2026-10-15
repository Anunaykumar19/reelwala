import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { markPaid } from "@/lib/payments";

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json().catch(() => ({}));
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  await markPaid(razorpay_order_id, razorpay_payment_id, null, razorpay_signature);
  return NextResponse.json({ ok: true });
}
