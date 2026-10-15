import { VIDEOS } from "./videos";

export type Reeler = {
  slug: string;
  name: string;
  avatar: string;
  city: string;
  citySlug: string;
  area: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  verified: boolean;
  responseTime: string;
  delivered: number;
  tags: string[];
  styles: string[];
  bio: string;
  reels: string[];
  coverReel: string;
  instagram: string;
  joined: string;
  lat: number;
  lng: number;
};

const r = (
  slug: string, name: string, img: number, city: string, citySlug: string, area: string,
  rating: number, reviews: number, price: number, delivered: number, tags: string[], styles: string[],
  bio: string, reels: string[], lat: number, lng: number, verified = true,
): Reeler => ({
  slug, name, avatar: `https://i.pravatar.cc/200?img=${img}`, city, citySlug, area, rating, reviews,
  startingPrice: price, verified, responseTime: ["~5 min", "~10 min", "~15 min", "~30 min"][img % 4],
  delivered, tags, styles, bio, reels, coverReel: reels[0], instagram: "@" + slug.replace(/-/g, "."),
  joined: "2025", lat, lng,
});

export const REELERS: Reeler[] = [
  r("aarav-shoots", "Aarav Mehta", 12, "Delhi NCR", "delhi-ncr", "Hauz Khas", 4.9, 212, 999, 340,
    ["Birthday", "Party", "Café"], ["trendy", "fast-cut"],
    "Hauz Khas ka sabse fast reeler. Trending audio + sharp cuts = your party, but cinematic.",
    [VIDEOS.party[0], VIDEOS.party[1], VIDEOS.cafe[0], VIDEOS.urban[0]], 28.5494, 77.2001),
  r("sana-frames", "Sana Qureshi", 47, "Delhi NCR", "delhi-ncr", "Gurgaon", 5.0, 178, 1499, 265,
    ["Wedding", "Haldi", "Engagement"], ["cinematic", "wedding"],
    "Shaadi reels with the feels. Slow-mo varmala, drone-style pans, zero cringe.",
    [VIDEOS.wedding[0], VIDEOS.wedding[1], VIDEOS.wedding[2], VIDEOS.party[9]], 28.4595, 77.0266),
  r("rohan-reels", "Rohan Kapoor", 33, "Delhi NCR", "delhi-ncr", "Noida", 4.8, 96, 999, 150,
    ["Café", "Product", "Shop Opening"], ["aesthetic", "trendy"],
    "Cafés, bakeries, boutiques. I make your shop look like a Pinterest board.",
    [VIDEOS.cafe[1], VIDEOS.product[0], VIDEOS.cafe[3], VIDEOS.product[1]], 28.5355, 77.391),
  r("priya-creates", "Priya Sharma", 44, "Delhi NCR", "delhi-ncr", "Saket", 4.9, 143, 1299, 210,
    ["Baby Shower", "Birthday", "Anniversary"], ["aesthetic", "cinematic"],
    "Soft, warm, family-first reels. Dadi se lekar baby tak, sab frame mein.",
    [VIDEOS.kids[0], VIDEOS.party[7], VIDEOS.wedding[3], VIDEOS.kids[2]], 28.5245, 77.2066),
  r("kabir-cuts", "Kabir Singh", 59, "Mumbai", "mumbai", "Bandra", 4.9, 301, 1499, 420,
    ["Party", "College Fest", "Influencer"], ["fast-cut", "trendy"],
    "Bandra nights, fest stages, creator collabs. Hype guaranteed, delivery in 24.",
    [VIDEOS.party[3], VIDEOS.party[4], VIDEOS.urban[1], VIDEOS.party[12]], 19.0596, 72.8295),
  r("meera-motion", "Meera Iyer", 24, "Mumbai", "mumbai", "Andheri", 4.8, 167, 999, 230,
    ["Café", "Product", "Influencer"], ["aesthetic", "cinematic"],
    "Food looks tastier through my lens. Ask any Andheri café.",
    [VIDEOS.cafe[2], VIDEOS.cafe[4], VIDEOS.product[2], VIDEOS.cafe[5]], 19.1136, 72.8697),
  r("zoya-films", "Zoya Khan", 16, "Mumbai", "mumbai", "Juhu", 5.0, 254, 1999, 310,
    ["Wedding", "Engagement", "Haldi"], ["wedding", "cinematic"],
    "Wedding reels that make the baraat cry (happy tears only).",
    [VIDEOS.wedding[4], VIDEOS.wedding[5], VIDEOS.wedding[6], VIDEOS.party[10]], 19.1075, 72.8263),
  r("dev-shots", "Dev Patel", 68, "Mumbai", "mumbai", "Powai", 4.7, 88, 999, 120,
    ["Birthday", "Party", "Anniversary"], ["trendy", "fast-cut"],
    "Powai ka party guy. Cake-cutting se dance floor tak, ek bhi moment miss nahi.",
    [VIDEOS.party[5], VIDEOS.party[6], VIDEOS.kids[1], VIDEOS.party[8]], 19.1176, 72.906),
  r("tanvi-takes", "Tanvi Agarwal", 20, "Jaipur", "jaipur", "C-Scheme", 4.9, 134, 1299, 190,
    ["Wedding", "Haldi", "Mehendi"], ["wedding", "aesthetic"],
    "Royal Rajasthani weddings, modern reel energy. Haveli vibes, trending audio.",
    [VIDEOS.wedding[1], VIDEOS.wedding[0], VIDEOS.party[11], VIDEOS.wedding[3]], 26.9115, 75.7935),
  r("arjun-visuals", "Arjun Rathore", 51, "Jaipur", "jaipur", "Malviya Nagar", 4.8, 112, 999, 160,
    ["Café", "Shop Opening", "Product"], ["aesthetic", "trendy"],
    "Pink city, pinker reels. Cafés, boutiques, and showroom launches.",
    [VIDEOS.cafe[6], VIDEOS.urban[2], VIDEOS.product[3], VIDEOS.cafe[0]], 26.8535, 75.8126),
  r("nisha-reelz", "Nisha Jain", 25, "Jaipur", "jaipur", "Vaishali Nagar", 4.9, 97, 999, 140,
    ["Birthday", "Baby Shower", "Party"], ["trendy", "cinematic"],
    "Birthdays ke liye Jaipur ki favourite. Balloons, cake, confetti, all in 4K.",
    [VIDEOS.kids[3], VIDEOS.party[2], VIDEOS.kids[0], VIDEOS.party[7]], 26.9124, 75.7436),
  r("vikram-vlogs", "Vikram Choudhary", 54, "Jaipur", "jaipur", "Mansarovar", 4.7, 73, 999, 95,
    ["College Fest", "Influencer", "Party"], ["fast-cut", "urban"],
    "Fests, gigs, street shoots. Fast cuts, faster delivery.",
    [VIDEOS.urban[3], VIDEOS.urban[4], VIDEOS.party[4], VIDEOS.urban[6]], 26.8505, 75.7643),
];

export const getReeler = (slug: string) => REELERS.find((x) => x.slug === slug);
