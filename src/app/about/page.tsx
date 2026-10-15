import Prose from "@/components/layout/Prose";
import MagneticButton from "@/components/ui/MagneticButton";
export const metadata = { title: "About" };
export default function About() {
  return (
    <Prose eyebrow="About" title="Har moment deserves a reel.">
      <p>Reelwala started in a Delhi café in 2025 when a friend quoted ₹18,000 for a “short video” of a birthday. We thought: the best reels on Instagram are shot on phones by people who understand the format. Why not connect them with everyone who needs one?</p>
      <h2>What we do</h2><p>We verify local reel makers, standardise pricing, handle payments, and guarantee delivery within 24 hours. Customers get professional reels at a fraction of a cameraman&apos;s cost. Reelers get a steady stream of paid work and a growing portfolio.</p>
      <h2>Where we are</h2><p>Delhi NCR, Mumbai and Jaipur today. Bengaluru, Pune and Hyderabad next. Edit-only works from anywhere in India.</p>
      <h2>Numbers</h2><ul><li>500+ reels delivered</li><li>120+ verified Reelers</li><li>4.9 average rating from verified bookings</li></ul>
      <div className="flex gap-3 pt-4"><MagneticButton href="/book">Book a Reeler</MagneticButton><MagneticButton href="/reeler/join" variant="glass">Become a Reeler</MagneticButton></div>
    </Prose>
  );
}
