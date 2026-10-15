"use client";
import { useCallback } from "react";

declare global { interface Window { Razorpay?: any } }

export function useRazorpay() {
  const load = useCallback(() => new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  }), []);

  const open = useCallback(async (opts: { keyId: string; orderId: string; amount: number; name?: string; description?: string; prefill?: Record<string, string | undefined>; onSuccess: (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void; onDismiss?: () => void }) => {
    const ok = await load();
    if (!ok) throw new Error("Razorpay failed to load");
    const rzp = new window.Razorpay({
      key: opts.keyId, amount: opts.amount * 100, currency: "INR", order_id: opts.orderId, name: opts.name || "Reelwala", description: opts.description,
      image: "/icon.png", prefill: opts.prefill, theme: { color: "#EC4899", backdrop_color: "rgba(10,10,15,.85)" }, handler: opts.onSuccess, modal: { ondismiss: opts.onDismiss },
    });
    rzp.open();
  }, [load]);
  return { open };
}
