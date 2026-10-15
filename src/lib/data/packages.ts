export type Package = {
  id: "starter" | "party" | "event";
  name: string;
  tagline: string;
  price: number;
  hours: number;
  reels: number;
  features: string[];
  popular?: boolean;
};

export const PACKAGES: Package[] = [
  { id: "starter", name: "Starter", tagline: "Chhota event, bada impact", price: 999, hours: 1, reels: 2,
    features: ["1 hour shoot", "2 edited reels", "Trending audio sync", "24-hr delivery", "1 free revision"] },
  { id: "party", name: "Party", tagline: "Most booked for birthdays", price: 1999, hours: 3, reels: 5, popular: true,
    features: ["3 hour shoot", "5 edited reels", "Captions + transitions", "24-hr delivery", "1 free revision", "Raw highlights (15 clips)"] },
  { id: "event", name: "Wedding / Event", tagline: "Full day, full vibe", price: 4999, hours: 10, reels: 10,
    features: ["Full day (up to 10 hrs)", "10+ edited reels", "Cinematic colour grade", "Priority 24-hr delivery", "2 free revisions", "All raw footage", "Dedicated support"] },
];

export const ADDONS = [
  { id: "extra-reel", name: "Extra reel", price: 299, unit: "per reel", desc: "Ek aur reel? Done." },
  { id: "raw-footage", name: "All raw footage", price: 499, unit: "flat", desc: "Every clip, untouched, via Drive" },
  { id: "same-day", name: "Same-day delivery", price: 699, unit: "flat", desc: "Reels before you sleep tonight" },
  { id: "drone", name: "Drone shots", price: 1999, unit: "flat", desc: "Where available & permitted" },
];

export const EDIT_PRICING = {
  perReel: 199,
  expressPerReel: 349,
  styles: ["Trending", "Cinematic", "Wedding", "Fast-cut", "Aesthetic", "Meme / Funny"],
  musicVibes: ["Bollywood", "Punjabi", "Lo-fi", "EDM", "Indie", "Trending audio"],
};

export const COMMISSION = 0.15;
export const TOKEN_PERCENT = 0.3;
