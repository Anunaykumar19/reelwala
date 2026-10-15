import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import { cn } from "@/lib/utils";

export default function PageShell({ children, className, footer = true, floating = true }: { children: React.ReactNode; className?: string; footer?: boolean; floating?: boolean }) {
  return (
    <main className={cn("relative min-h-[100svh]", className)}>
      <Navbar />
      <div className="pt-24 md:pt-28">{children}</div>
      {footer && <Footer />}
      {floating && <FloatingActions />}
    </main>
  );
}
