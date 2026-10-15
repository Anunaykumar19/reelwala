import { prisma } from "@/lib/db";

export const DEV_OTP = process.env.DEV_OTP || "123456";
export const smsConfigured = () => !!process.env.MSG91_AUTH_KEY;

export async function issueOtp(phone: string) {
  const code = smsConfigured() ? String(Math.floor(100000 + Math.random() * 900000)) : DEV_OTP;
  await prisma.otpCode.updateMany({ where: { phone, used: false }, data: { used: true } });
  await prisma.otpCode.create({ data: { phone, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
  if (smsConfigured()) {
    // MSG91 flow API. Template must contain {{otp}}.
    await fetch("https://control.msg91.com/api/v5/otp?" + new URLSearchParams({ mobile: "91" + phone, otp: code, template_id: process.env.MSG91_TEMPLATE_ID || "" }), { method: "POST", headers: { authkey: process.env.MSG91_AUTH_KEY! } }).catch((e) => console.error("[otp] send failed", e));
  } else {
    console.log(`[otp] DEV code for +91${phone}: ${code}`);
  }
  return { dev: !smsConfigured() };
}

export async function verifyOtp(phone: string, code: string) {
  const row = await prisma.otpCode.findFirst({ where: { phone, code, used: false, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } });
  if (!row) return false;
  await prisma.otpCode.update({ where: { id: row.id }, data: { used: true } });
  return true;
}
