import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { id, status, deliverables } = await req.json().catch(() => ({}));
  const data: any = { status };
  if (status === "DELIVERED" && Array.isArray(deliverables)) data.deliverables = JSON.stringify(deliverables.filter((d: any) => typeof d?.url === "string"));
  await prisma.editOrder.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
