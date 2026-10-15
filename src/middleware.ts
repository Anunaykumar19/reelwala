import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ token, req }) => {
      const p = req.nextUrl.pathname;
      if (!token) return false;
      if (p.startsWith("/admin")) return token.role === "ADMIN";
      if (p.startsWith("/reeler/dashboard")) return token.role === "REELER" || token.role === "ADMIN";
      return true;
    },
  },
});

export const config = { matcher: ["/dashboard/:path*", "/reeler/dashboard/:path*", "/admin/:path*"] };
