import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireReeler() {
  const session = await auth();
  if (!session?.user) return { error: "Login required", status: 401 } as const;
  const reeler = await prisma.reeler.findUnique({ where: { userId: session.user.id } });
  if (!reeler) return { error: "No reeler profile", status: 403 } as const;
  return { reeler, session } as const;
}
