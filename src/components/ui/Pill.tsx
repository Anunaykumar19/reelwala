import { cn } from "@/lib/utils";
export default function Pill({ children, className, tone = "default" }: { children: React.ReactNode; className?: string; tone?: "default" | "cyan" | "brand" }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
      tone === "default" && "bg-fg/8 text-fg/80 border border-fg/10",
      tone === "cyan" && "bg-cyan/15 text-cyan border border-cyan/30",
      tone === "brand" && "bg-brand text-white", className)}>
      {children}
    </span>
  );
}
