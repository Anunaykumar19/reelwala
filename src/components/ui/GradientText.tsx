import { cn } from "@/lib/utils";
export default function GradientText({ children, className, animate }: { children: React.ReactNode; className?: string; animate?: boolean }) {
  return <span className={cn("text-gradient", animate && "text-gradient-animate", className)}>{children}</span>;
}
