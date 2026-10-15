"use client";
import { useEffect, useState } from "react";

export default function Countdown({ to, className, done = "Now" }: { to: string | Date; className?: string; done?: string }) {
  const [left, setLeft] = useState(() => new Date(to).getTime() - Date.now());
  useEffect(() => { const t = setInterval(() => setLeft(new Date(to).getTime() - Date.now()), 1000); return () => clearInterval(t); }, [to]);
  if (left <= 0) return <span className={className}>{done}</span>;
  const d = Math.floor(left / 86400000), h = Math.floor((left % 86400000) / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return <span className={className}>{d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`}</span>;
}
