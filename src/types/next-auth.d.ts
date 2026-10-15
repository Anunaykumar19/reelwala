import "next-auth";
declare module "next-auth" {
  interface Session { user: { id: string; role: "CUSTOMER" | "REELER" | "ADMIN"; name?: string | null; email?: string | null; image?: string | null; phone?: string | null } }
  interface User { role?: string; phone?: string | null }
}
declare module "next-auth/jwt" { interface JWT { id?: string; role?: string; phone?: string | null } }
