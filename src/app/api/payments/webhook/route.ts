import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { markPaid } from "@/lib/payments";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  if (!verifyWebhookSignature(body, sig)) return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  const evt = JSON.parse(body);
  const pay = evt?.payload?.payment?.entity;
  try {
    if (evt.event === "payment.captured" && pay?.order_id) await markPaid(pay.order_id, pay.id, pay);
    if (evt.event === "payment.failed" && pay?.order_id) await prisma.payment.updateMany({ where: { orderId: pay.order_id, status: "CREATED" }, data: { status: "FAILED", raw: JSON.stringify(pay).slice(0, 4000) } });
    if (evt.event === "refund.processed") { const r = evt.payload.refund.entity; await prisma.payment.updateMany({ where: { paymentId: r.payment_id }, data: { status: "REFUNDED", refundId: r.id, refundAmount: Math.round(r.amount / 100) } }); }
  } catch (e) { console.error("[webhook]", e); }
  return NextResponse.json({ received: true });
}
