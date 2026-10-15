import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";

const refCode = () => "RW" + Math.random().toString(36).slice(2, 7).toUpperCase();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt", maxAge: 30 * 24 * 3600 },
  pages: { signIn: "/login" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : []),
    CredentialsProvider({
      id: "otp",
      name: "Phone OTP",
      credentials: { phone: { label: "Phone", type: "text" }, code: { label: "OTP", type: "text" }, role: { label: "Role", type: "text" }, name: { label: "Name", type: "text" } },
      async authorize(c) {
        if (!c?.phone || !/^\d{10}$/.test(c.phone) || !c.code) return null;
        const ok = await verifyOtp(c.phone, c.code);
        if (!ok) return null;
        const role = c.role === "REELER" ? "REELER" : "CUSTOMER";
        const user = await prisma.user.upsert({ where: { phone: c.phone }, update: { name: c.name || undefined }, create: { phone: c.phone, name: c.name || null, role, referralCode: refCode() } });
        if (user.role === "CUSTOMER" && role === "REELER") await prisma.user.update({ where: { id: user.id }, data: { role: "REELER" } });
        return { id: user.id, name: user.name, email: user.email, image: user.image, role: role === "REELER" ? "REELER" : user.role, phone: user.phone };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) { token.id = user.id; token.role = (user as any).role || "CUSTOMER"; token.phone = (user as any).phone || null; }
      if (trigger === "update" || (!token.role && token.id)) {
        const u = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (u) { token.role = u.role; token.phone = u.phone; token.name = u.name; token.picture = u.image; }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as any) || "CUSTOMER";
      session.user.phone = token.phone as string | null;
      return session;
    },
  },
  events: {
    async createUser({ user }) { await prisma.user.update({ where: { id: user.id }, data: { referralCode: refCode() } }).catch(() => {}); },
  },
};

export const auth = () => getServerSession(authOptions);
