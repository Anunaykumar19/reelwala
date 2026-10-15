import crypto from "crypto";

export const razorpayConfigured = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export async function createRazorpayOrder(amountRupees: number, receipt: string, notes: Record<string, string> = {}) {
  const Razorpay = (await import("razorpay")).default;
  const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
  return rzp.orders.create({ amount: amountRupees * 100, currency: "INR", receipt, notes });
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const h = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${orderId}|${paymentId}`).digest("hex");
  return h === signature;
}

export function verifyWebhookSignature(body: string, signature: string) {
  const h = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "").update(body).digest("hex");
  return h === signature;
}

export async function refundPayment(paymentId: string, amountRupees?: number) {
  const Razorpay = (await import("razorpay")).default;
  const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
  return rzp.payments.refund(paymentId, amountRupees ? { amount: amountRupees * 100 } : {});
}
