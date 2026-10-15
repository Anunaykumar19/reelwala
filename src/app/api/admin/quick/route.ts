import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { id, status } = await req.json().catch(() => ({}));
  await prisma.quickRequest.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
