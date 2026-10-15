import Prose from "@/components/layout/Prose";
export const metadata = { title: "Privacy Policy" };
export default function Privacy() {
  return (
    <Prose eyebrow="Legal" title="Privacy Policy" updated="15 October 2026">
      <p>We collect only what we need to run your booking: name, phone, email, shoot address, payment references and the footage you upload for editing.</p>
      <h2>What we use it for</h2><ul><li>Matching you with a Reeler and sharing the shoot address with them.</li><li>Payments via Razorpay. We never see or store full card numbers.</li><li>WhatsApp, SMS and email updates about your booking. No marketing without consent.</li><li>Fraud prevention and legal compliance.</li></ul>
      <h2>Uploaded footage</h2><p>Footage uploaded for the Edit-Only service is stored encrypted, shared only with the assigned editor, and deleted 30 days after delivery unless you ask us to keep it.</p>
      <h2>Your rights</h2><p>Email privacy@reelwala.in to access, correct or delete your data. We respond within 7 working days. Location data is used only when you tap “Use my location” and is not stored.</p>
      <h2>Cookies & analytics</h2><p>We use essential cookies for login and Google Analytics 4 for aggregate usage. You can opt out of analytics via your browser settings.</p>
    </Prose>
  );
}
