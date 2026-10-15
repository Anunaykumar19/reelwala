import Prose from "@/components/layout/Prose";
import MagneticButton from "@/components/ui/MagneticButton";
import { waLink } from "@/lib/utils";
export const metadata = { title: "Contact" };
export default function Contact() {
  return (
    <Prose eyebrow="Contact" title="Baat karte hain.">
      <p>Fastest: WhatsApp. A human replies within minutes, 9 AM to 11 PM, every day.</p>
      <div className="flex flex-wrap gap-3 pt-2"><MagneticButton href={waLink("Hi Reelwala! I have a question.")} glow>WhatsApp us</MagneticButton><MagneticButton href="mailto:hello@reelwala.in" variant="glass">hello@reelwala.in</MagneticButton></div>
      <h2>Reelers</h2><p>Questions about verification, payouts or guidelines: reelers@reelwala.in</p>
      <h2>Business & café partnerships</h2><p>Monthly content plans for cafés, salons, gyms and boutiques: partners@reelwala.in</p>
      <h2>Office</h2><p>Reelwala Technologies Pvt. Ltd.<br />Hauz Khas, New Delhi 110016</p>
    </Prose>
  );
}
