"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "./SmoothScroll";
import ThemeInit from "./ThemeInit";
import Cursor from "@/components/ui/Cursor";
import ReelViewer from "@/components/reels/ReelViewer";
import QuickBookModal from "@/components/home/QuickBookModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <ThemeInit />
      <SmoothScroll>{children}</SmoothScroll>
      <Cursor />
      <ReelViewer />
      <QuickBookModal />
      <div className="grain" aria-hidden />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: "rgb(var(--surface-2))", color: "rgb(var(--fg))", border: "1px solid var(--glass-border)", borderRadius: 16, fontSize: 14 },
          success: { iconTheme: { primary: "#22D3EE", secondary: "#0A0A0F" } },
        }}
      />
    </QueryClientProvider>
  );
}
