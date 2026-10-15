import { NextResponse } from "next/server";
import { availableReelers, serializeReeler } from "@/lib/booking-utils";
import { CITIES } from "@/lib/data/cities";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const cityName = u.searchParams.get("city") || "";
  const city = CITIES.find((c) => c.name === cityName || c.slug === cityName);
  const date = u.searchParams.get("date");
  if (!city || !date) return NextResponse.json({ error: "city and date required" }, { status: 400 });
  const list = await availableReelers(city.slug, new Date(date), u.searchParams.get("start") || "18:00", Number(u.searchParams.get("hours") || 3));
  return NextResponse.json({ reelers: list.map(serializeReeler) });
}
