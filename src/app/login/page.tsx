import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthView from "@/components/auth/AuthView";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Login" };

export default async function Page() {
  const session = await auth();
  if (session?.user) redirect(session.user.role === "REELER" ? "/reeler/dashboard" : session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  return <Suspense fallback={null}><AuthView mode="login" googleEnabled={!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} /></Suspense>;
}
