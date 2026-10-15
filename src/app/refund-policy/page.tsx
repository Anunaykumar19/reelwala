import Prose from "@/components/layout/Prose";
export const metadata = { title: "Refund & Cancellation Policy" };
export default function Refund() {
  return (
    <Prose eyebrow="Legal" title="Refund & Cancellation Policy" updated="15 October 2026">
      <h2>Cancelling a shoot</h2><ul><li><strong>More than 24 hours before the shoot:</strong> free cancellation. Every rupee paid is refunded to the original payment method in 5 to 7 working days.</li><li><strong>Within 24 hours of the shoot:</strong> the 30% token is non-refundable. Any amount paid above the token is refunded.</li><li><strong>No-show by the customer:</strong> treated as a cancellation within 24 hours.</li></ul>
      <h2>If the Reeler cancels</h2><p>You get a full refund plus ₹200 Reelwala credit, or we assign another verified Reeler at no extra cost. Your choice.</p>
      <h2>Rescheduling</h2><p>Free once, if requested more than 24 hours before the shoot and the Reeler is available. Otherwise treated as a cancellation and new booking.</p>
      <h2>Edit-only orders</h2><p>Refundable in full until editing starts (status “Editing”). After that, one free revision is included; refunds are at our discretion if the delivered reel does not match the brief.</p>
      <h2>Late delivery</h2><p>If reels arrive after the 24-hour window without a weather or venue reason, you get 10% of the booking value as credit, automatically.</p>
      <h2>How to cancel</h2><p>From your dashboard, or WhatsApp us with the booking code. Refunds are initiated the same day.</p>
    </Prose>
  );
}
