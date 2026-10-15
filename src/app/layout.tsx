import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Reelwala — Aaspaas ka Reeler, 24 ghante me Reel", template: "%s · Reelwala" },
  description: "Book verified local reel makers for birthdays, weddings, parties, cafés & more. Shot today, edited reel ready in 24 hours. Starting ₹999.",
  openGraph: { title: "Reelwala — Book a reel maker near you", description: "Mehenga cameraman nahi, Reeler book karo. Reels in 24 hrs from ₹999.", type: "website", locale: "en_IN" },
  keywords: ["reel maker", "book videographer", "instagram reels", "birthday reel", "wedding reel", "Delhi", "Mumbai", "Jaipur"],
};
export const viewport: Viewport = { themeColor: "#0A0A0F", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('rw-theme')==='light')document.documentElement.classList.add('light')}catch(e){}` }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
