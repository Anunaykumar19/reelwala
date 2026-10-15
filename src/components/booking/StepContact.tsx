"use client";
import { useBooking } from "@/store/booking";
import MagneticButton from "@/components/ui/MagneticButton";
import { Music2, AtSign as Instagram, User, Phone, Mail, MessageSquareText } from "lucide-react";

const Field = ({ label, icon: I, children }: { label: string; icon: any; children: React.ReactNode }) => (
  <label className="block"><span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5"><I size={13} /> {label}</span><div className="mt-2">{children}</div></label>
);
const inp = "h-12 w-full rounded-2xl bg-surface-2 border border-fg/10 px-4 text-sm outline-none focus:ring-2 focus:ring-pink/50";

export default function StepContact() {
  const b = useBooking();
  const valid = b.contactName.trim().length > 1 && /^\d{10}$/.test(b.contactPhone);
  return (
    <div>
      <h2 className="font-display text-h2 font-semibold">Aapke <span className="text-gradient">details.</span></h2>
      <p className="mt-2 text-muted">We confirm on WhatsApp. No spam, promise.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field label="Your name" icon={User}><input className={inp} value={b.contactName} onChange={(e) => b.set({ contactName: e.target.value })} placeholder="Priya Sharma" /></Field>
        <Field label="WhatsApp number" icon={Phone}>
          <div className={inp + " flex items-center p-0"}><span className="px-4 text-sm text-muted border-r border-fg/10">+91</span><input inputMode="numeric" maxLength={10} className="h-full flex-1 bg-transparent px-4 text-sm outline-none" value={b.contactPhone} onChange={(e) => b.set({ contactPhone: e.target.value.replace(/\D/g, "") })} placeholder="98765 43210" /></div>
        </Field>
        <Field label="Email (for invoice)" icon={Mail}><input type="email" className={inp} value={b.contactEmail} onChange={(e) => b.set({ contactEmail: e.target.value })} placeholder="you@example.com" /></Field>
        <Field label="Instagram handle" icon={Instagram}><input className={inp} value={b.instagram} onChange={(e) => b.set({ instagram: e.target.value })} placeholder="@yourhandle (we tag you)" /></Field>
        <div className="md:col-span-2"><Field label="Songs / vibe references" icon={Music2}><input className={inp} value={b.songRefs} onChange={(e) => b.set({ songRefs: e.target.value })} placeholder="Paste reel links or song names you love" /></Field></div>
        <div className="md:col-span-2"><Field label="Special instructions" icon={MessageSquareText}><textarea rows={3} className={inp + " h-auto py-3 resize-none"} value={b.instructions} onChange={(e) => b.set({ instructions: e.target.value })} placeholder="Cake cutting at 7:30, nani ko zaroor cover karna, no drone please…" /></Field></div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button onClick={b.back} className="text-sm text-muted hover:text-fg">← Back</button>
        <MagneticButton onClick={b.next} disabled={!valid}>Review & pay →</MagneticButton>
      </div>
    </div>
  );
}
