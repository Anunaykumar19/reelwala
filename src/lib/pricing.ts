import { ADDONS, PACKAGES, TOKEN_PERCENT } from "@/lib/data/packages";

export type AddonSel = Record<string, boolean>;
export type CouponInfo = { code: string; type: "FLAT" | "PERCENT"; value: number; minAmount: number } | null;

export function computePrice(opts: { packageKey: string; packagePrice?: number; addons: AddonSel; extraReels: number; coupon: CouponInfo; paymentMode: "TOKEN" | "FULL"; credits?: number }) {
  const pkg = PACKAGES.find((p) => p.id === opts.packageKey) || PACKAGES[0];
  const base = opts.packagePrice ?? pkg.price;
  const addonLines = ADDONS.filter((a) => opts.addons[a.id] && a.id !== "extra-reel").map((a) => ({ id: a.id, name: a.name, price: a.price, qty: 1 }));
  if (opts.extraReels > 0) addonLines.push({ id: "extra-reel", name: "Extra reels", price: 299, qty: opts.extraReels });
  const addonsTotal = addonLines.reduce((s, a) => s + a.price * a.qty, 0);
  const subtotal = base + addonsTotal;
  let discount = 0;
  if (opts.coupon && subtotal >= opts.coupon.minAmount) discount = opts.coupon.type === "FLAT" ? opts.coupon.value : Math.round((subtotal * opts.coupon.value) / 100);
  discount = Math.min(discount + (opts.credits || 0), subtotal - 1);
  const total = subtotal - discount;
  const token = Math.round(total * TOKEN_PERCENT);
  const payNow = opts.paymentMode === "TOKEN" ? token : total;
  return { base, addonLines, addonsTotal, subtotal, discount, total, token, payNow, due: total - payNow, pkg };
}
