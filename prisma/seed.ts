import { PrismaClient } from "@prisma/client";
import { REELERS } from "../src/lib/data/reelers";
import { CITIES } from "../src/lib/data/cities";
import { PACKAGES } from "../src/lib/data/packages";

const prisma = new PrismaClient();

async function main() {
  for (const c of CITIES) {
    await prisma.city.upsert({ where: { slug: c.slug }, update: { name: c.name, state: c.state, live: c.live, lat: c.lat, lng: c.lng, areas: JSON.stringify(c.areas) }, create: { slug: c.slug, name: c.name, state: c.state, live: c.live, lat: c.lat, lng: c.lng, areas: JSON.stringify(c.areas) } });
  }
  const admin = await prisma.user.upsert({ where: { email: "admin@reelwala.in" }, update: {}, create: { email: "admin@reelwala.in", name: "Reelwala Ops", role: "ADMIN", referralCode: "RWADMIN" } });
  const demo = await prisma.user.upsert({ where: { phone: "9999999999" }, update: {}, create: { phone: "9999999999", name: "Demo Customer", email: "demo@reelwala.in", role: "CUSTOMER", referralCode: "DEMO100" } });

  for (const r of REELERS) {
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: r.citySlug } });
    const user = await prisma.user.upsert({ where: { email: `${r.slug}@reelwala.in` }, update: {}, create: { email: `${r.slug}@reelwala.in`, name: r.name, image: r.avatar, role: "REELER", referralCode: r.slug.toUpperCase().replace(/-/g, "").slice(0, 8) } });
    const reeler = await prisma.reeler.upsert({
      where: { slug: r.slug },
      update: { rating: r.rating, reviewCount: r.reviews, delivered: r.delivered },
      create: {
        userId: user.id, slug: r.slug, displayName: r.name, avatar: r.avatar, bio: r.bio, cityId: city.id, area: r.area, lat: r.lat, lng: r.lng,
        instagram: r.instagram, tags: JSON.stringify(r.tags), styles: JSON.stringify(r.styles), startingPrice: r.startingPrice, rating: r.rating,
        reviewCount: r.reviews, delivered: r.delivered, responseTime: r.responseTime, status: "VERIFIED", coverReel: r.coverReel, equipment: "iPhone 15 Pro, DJI Osmo Mobile 6, Rode Wireless Go",
      },
    });
    await prisma.portfolioReel.deleteMany({ where: { reelerId: reeler.id } });
    await prisma.portfolioReel.createMany({ data: r.reels.map((url, i) => ({ reelerId: reeler.id, url, order: i, occasion: r.tags[i % r.tags.length] })) });
    const bump = r.startingPrice - 999; // reeler-specific markup within ±20% window
    for (const p of PACKAGES) {
      const price = Math.round(Math.min(p.price * 1.2, Math.max(p.price * 0.8, p.price + bump)) / 10) * 10;
      await prisma.reelerPackage.upsert({ where: { reelerId_key: { reelerId: reeler.id, key: p.id } }, update: { price }, create: { reelerId: reeler.id, key: p.id, price, hours: p.hours, reels: p.reels } });
    }
    // block a couple of upcoming dates so the calendar looks real
    const d1 = new Date(); d1.setDate(d1.getDate() + 3 + (r.slug.length % 5)); d1.setHours(0, 0, 0, 0);
    const d2 = new Date(d1); d2.setDate(d2.getDate() + 6);
    for (const d of [d1, d2]) await prisma.blockedDate.upsert({ where: { reelerId_date: { reelerId: reeler.id, date: d } }, update: {}, create: { reelerId: reeler.id, date: d, reason: "Booked" } });
  }

  // reviews from completed bookings so profiles look lived-in
  const REVIEWS = [
    ["Ritika S.", 5, "Booked at 11am, reeler aaya 4pm, reels next morning. Party went viral in the family group 😂"],
    ["Manav T.", 5, "Super professional, got 5 reels in 20 hours. Trending audio choice was perfect."],
    ["Café Amora", 5, "Our opening reel hit 80K views. A cameraman quoted ₹15K for the same thing."],
    ["Harsh & Ananya", 5, "So chill with the family. The haldi reel made my nani cry. Would book again."],
    ["Sneha K.", 4, "Great reels, one revision needed on captions and it was done in an hour."],
    ["Aditya R.", 5, "Fast cuts, clean colour grade, delivered before the deadline. Paisa vasool."],
  ];
  const allReelers = await prisma.reeler.findMany();
  for (let ri = 0; ri < allReelers.length; ri++) {
    const reeler = allReelers[ri];
    const existing = await prisma.review.count({ where: { reelerId: reeler.id } });
    if (existing > 0) continue;
    const city = await prisma.city.findUniqueOrThrow({ where: { id: reeler.cityId } });
    for (let k = 0; k < 3; k++) {
      const [name, rating, text] = REVIEWS[(ri + k) % REVIEWS.length];
      const phone = `98${String(ri * 10 + k).padStart(8, "0")}`;
      const u = await prisma.user.upsert({ where: { phone }, update: {}, create: { phone, name: String(name), role: "CUSTOMER" } });
      const d = new Date(); d.setDate(d.getDate() - (7 + k * 9 + ri));
      const total = 1999;
      const bk = await prisma.booking.create({ data: { code: "RW-S" + (ri * 10 + k).toString(36).toUpperCase().padStart(5, "0"), userId: u.id, reelerId: reeler.id, cityId: city.id, occasion: ["Birthday", "Wedding", "Café Launch"][k], date: d, startTime: "18:00", durationHrs: 3, address: "Seeded booking", packageKey: "party", packagePrice: total, addons: "[]", contactName: String(name), contactPhone: phone, subtotal: total, total, paymentMode: "FULL", amountPaid: total, amountDue: 0, status: "DELIVERED", deliveredAt: d } });
      await prisma.review.create({ data: { bookingId: bk.id, reelerId: reeler.id, userId: u.id, rating: Number(rating), text: String(text) } });
    }
  }

  for (const c of [
    { code: "FIRST100", type: "FLAT", value: 100, minAmount: 999 },
    { code: "REEL20", type: "PERCENT", value: 20, minAmount: 1999, maxUses: 500 },
    { code: "SHAADI500", type: "FLAT", value: 500, minAmount: 4999 },
  ]) await prisma.coupon.upsert({ where: { code: c.code }, update: {}, create: c });

  console.log("Seeded:", { admin: admin.email, demo: demo.phone, reelers: REELERS.length, cities: CITIES.length });
}

main().finally(() => prisma.$disconnect());
