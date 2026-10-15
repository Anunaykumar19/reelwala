export type Occasion = { slug: string; name: string; hinglish: string; emoji: string; videoKey: "party" | "wedding" | "cafe" | "urban" | "kids" | "product" };

export const OCCASIONS: Occasion[] = [
  { slug: "birthday", name: "Birthday", hinglish: "Birthday Bash", emoji: "🎂", videoKey: "kids" },
  { slug: "wedding", name: "Wedding", hinglish: "Shaadi", emoji: "💍", videoKey: "wedding" },
  { slug: "haldi-mehendi", name: "Haldi / Mehendi", hinglish: "Haldi & Mehendi", emoji: "🌼", videoKey: "wedding" },
  { slug: "engagement", name: "Engagement", hinglish: "Sagai", emoji: "💞", videoKey: "wedding" },
  { slug: "baby-shower", name: "Baby Shower", hinglish: "Godh Bharai", emoji: "🍼", videoKey: "kids" },
  { slug: "party", name: "House Party", hinglish: "Party", emoji: "🪩", videoKey: "party" },
  { slug: "cafe-launch", name: "Café / Restaurant", hinglish: "Café Launch", emoji: "☕", videoKey: "cafe" },
  { slug: "shop-opening", name: "Shop Opening", hinglish: "Dukaan Opening", emoji: "🎉", videoKey: "urban" },
  { slug: "college-fest", name: "College Fest", hinglish: "Fest", emoji: "🎤", videoKey: "party" },
  { slug: "product-shoot", name: "Product Shoot", hinglish: "Product Reel", emoji: "📦", videoKey: "product" },
  { slug: "influencer", name: "Influencer Content", hinglish: "Creator Content", emoji: "✨", videoKey: "urban" },
  { slug: "anniversary", name: "Anniversary", hinglish: "Anniversary", emoji: "🥂", videoKey: "party" },
];
