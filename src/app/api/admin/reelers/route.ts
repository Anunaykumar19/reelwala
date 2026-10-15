import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { id, status } = await req.json().catch(() => ({}));
  if (!["VERIFIED", "REJECTED", "SUSPENDED", "PENDING"].includes(status)) return NextResponse.json({ error: "Bad status" }, { status: 400 });
  await prisma.reeler.update({ where: { id }, data: { status } });
  if (status === "VERIFIED") await prisma.portfolioReel.updateMany({ where: { reelerId: id }, data: { approved: true } });
  return NextResponse.json({ ok: true });
}
