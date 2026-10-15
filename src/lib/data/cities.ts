export type City = { slug: string; name: string; state: string; areas: string[]; live: boolean; lat: number; lng: number };

export const CITIES: City[] = [
  { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi", live: true, lat: 28.6139, lng: 77.209, areas: ["Hauz Khas", "Saket", "Gurgaon", "Noida", "Rajouri Garden", "Dwarka", "Connaught Place", "Lajpat Nagar"] },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", live: true, lat: 19.076, lng: 72.8777, areas: ["Bandra", "Andheri", "Juhu", "Powai", "Lower Parel", "Thane", "Borivali", "Colaba"] },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", live: true, lat: 26.9124, lng: 75.7873, areas: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar", "Tonk Road", "Jagatpura"] },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", live: false, lat: 12.9716, lng: 77.5946, areas: [] },
  { slug: "pune", name: "Pune", state: "Maharashtra", live: false, lat: 18.5204, lng: 73.8567, areas: [] },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", live: false, lat: 17.385, lng: 78.4867, areas: [] },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", live: false, lat: 26.8467, lng: 80.9462, areas: [] },
  { slug: "chandigarh", name: "Chandigarh", state: "Punjab", live: false, lat: 30.7333, lng: 76.7794, areas: [] },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", live: false, lat: 22.7196, lng: 75.8577, areas: [] },
];

export const LIVE_CITIES = CITIES.filter((c) => c.live);
