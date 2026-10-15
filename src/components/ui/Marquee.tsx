import { cn } from "@/lib/utils";

export default function Marquee({ children, className, reverse, speed = 30 }: { children: React.ReactNode; className?: string; reverse?: boolean; speed?: number }) {
  return (
    <div className={cn("relative flex overflow-hidden mask-fade-x", className)}>
      <div
        className="flex shrink-0 items-center gap-6 animate-marquee"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
