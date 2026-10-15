import { VIDEOS } from "./videos";

export const STATS = [
  { label: "Reels delivered", value: 500, suffix: "+" },
  { label: "Verified reelers", value: 120, suffix: "+" },
  { label: "Cities live", value: 3, suffix: "" },
  { label: "Avg. rating", value: 4.9, suffix: "★", decimals: 1 },
];

export const TESTIMONIALS = [
  { name: "Ritika S.", city: "Gurgaon", occasion: "Birthday", text: "Booked at 11am, reeler aaya 4pm, reels next morning. My daughter's party went viral in the family group 😂", rating: 5, video: VIDEOS.kids[0] },
  { name: "Café Amora", city: "Bandra", occasion: "Café launch", text: "₹1,999 me 5 reels. Our opening reel hit 80K views. A cameraman quoted ₹15K for the same thing.", rating: 5, video: VIDEOS.cafe[0] },
  { name: "Harsh & Ananya", city: "Jaipur", occasion: "Haldi", text: "Tanvi was so chill with the family. The haldi reel made my nani cry. 10/10 would book again.", rating: 5, video: VIDEOS.wedding[1] },
  { name: "Manav T.", city: "Noida", occasion: "Edit only", text: "Sent 40 raw clips from my phone, got 3 clean reels in 18 hours. Didn't even leave my bed.", rating: 5, video: VIDEOS.urban[0] },
];

export const FAQS = [
  { q: "Reeler aur cameraman me kya difference hai?", a: "A Reeler shoots on a pro phone or mirrorless, specifically for Instagram Reels (vertical, trending audio, fast cuts). No bulky gear, no ₹15K bills. You get edited reels, not a 2-hour raw video." },
  { q: "Reels kab milenge?", a: "Within 24 hours of your shoot ending, guaranteed. Need faster? Add Same-day delivery (₹699) and get them tonight." },
  { q: "What if I already have footage?", a: "Use our Edit-Only service. Upload clips from your phone, pick a style, and get an edited reel from ₹199. Express 6-hour delivery available." },
  { q: "Are the reelers verified?", a: "Yes. Every Reeler submits ID proof and 3 sample reels, which our team reviews before they get the Verified badge. Reviews are only from real completed bookings." },
  { q: "Cancellation policy?", a: "Free cancellation up to 24 hours before the shoot. Inside 24 hours, the 30% token is non-refundable. If a Reeler cancels on you, full refund plus ₹200 credit." },
  { q: "Payment kaise hota hai?", a: "UPI, cards, wallets via Razorpay. Pay 30% token now and the rest after the shoot, or pay in full. You get an invoice instantly." },
  { q: "Kaunse cities me available ho?", a: "Delhi NCR, Mumbai and Jaipur right now. Bengaluru, Pune and Hyderabad launching soon. Join the waitlist on the city page." },
];

export const COMPARISON = [
  { feature: "Starting price", reelwala: "₹999", others: "₹8,000–25,000" },
  { feature: "Delivery time", reelwala: "24 hours", others: "2–4 weeks" },
  { feature: "Verified creators", reelwala: true, others: false },
  { feature: "Edit-only option", reelwala: true, others: false },
  { feature: "Reels-first (9:16, trending audio)", reelwala: true, others: false },
  { feature: "WhatsApp support", reelwala: true, others: false },
  { feature: "Free revision", reelwala: true, others: false },
  { feature: "Transparent pricing", reelwala: true, others: false },
];

export const SHOWCASE = [
  { occasion: "Birthday", items: [VIDEOS.kids[0], VIDEOS.party[7], VIDEOS.kids[3], VIDEOS.party[2]] },
  { occasion: "Shaadi", items: [VIDEOS.wedding[0], VIDEOS.wedding[3], VIDEOS.wedding[4], VIDEOS.wedding[1]] },
  { occasion: "Party", items: [VIDEOS.party[0], VIDEOS.party[3], VIDEOS.party[5], VIDEOS.party[12]] },
  { occasion: "Café", items: [VIDEOS.cafe[0], VIDEOS.cafe[2], VIDEOS.cafe[4], VIDEOS.cafe[6]] },
  { occasion: "Product", items: [VIDEOS.product[0], VIDEOS.product[1], VIDEOS.product[2], VIDEOS.cafe[5]] },
  { occasion: "Creator", items: [VIDEOS.urban[0], VIDEOS.urban[1], VIDEOS.urban[2], VIDEOS.urban[3]] },
];
