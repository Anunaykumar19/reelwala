import Prose from "@/components/layout/Prose";
export const metadata = { title: "Terms of Service" };
export default function Terms() {
  return (
    <Prose eyebrow="Legal" title="Terms of Service" updated="15 October 2026">
      <p>Reelwala (“we”, “us”) operates a marketplace connecting customers with independent reel makers (“Reelers”). By using reelwala.in you agree to these terms.</p>
      <h2>1. Bookings</h2><ul><li>A booking is confirmed when the token (30%) or full amount is paid.</li><li>The balance is payable after the shoot and before delivery of edited reels.</li><li>Shoot timings, duration and location are as entered by you. Overtime is billed at the package hourly rate.</li></ul>
      <h2>2. Delivery</h2><ul><li>Edited reels are delivered within 24 hours of the Reeler marking the shoot complete. Express and same-day options have their own windows.</li><li>One free revision per booking covers edits to music, captions, order of clips or colour. Reshoots are not revisions.</li></ul>
      <h2>3. Cancellation & refunds</h2><p>See our <a href="/refund-policy">Refund & Cancellation Policy</a>. In short: free cancellation up to 24 hours before the shoot; within 24 hours the token is non-refundable.</p>
      <h2 id="reelers">4. Reeler guidelines</h2><ul><li>Reelers are independent contractors, verified by ID and portfolio review.</li><li>Reelwala retains a 15% platform fee on every booking; the remaining 85% is paid to the Reeler within one working day of delivery.</li><li>Reelers must not solicit Reelwala customers off-platform. Doing so leads to permanent removal and forfeiture of pending payouts.</li><li>Three late deliveries or two declined-after-acceptance bookings in 60 days trigger a review.</li></ul>
      <h2>5. Content</h2><p>You grant Reelwala and the Reeler a licence to use delivered reels for portfolio and marketing unless you opt out in writing before the shoot. You own the delivered reels for personal and commercial use.</p>
      <h2>6. Liability</h2><p>Our liability for any booking is limited to the amount paid for that booking. We are not liable for venue restrictions, weather or events outside our control.</p>
      <h2>7. Contact</h2><p>legal@reelwala.in · Reelwala Technologies Pvt. Ltd., New Delhi.</p>
    </Prose>
  );
}
