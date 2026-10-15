export const BOOKING_STEPS = [
  { key: "BOOKED", label: "Booked", hint: "Token received" },
  { key: "ASSIGNED", label: "Reeler assigned", hint: "Confirmed & briefed" },
  { key: "SHOOT_DONE", label: "Shoot done", hint: "24-hr clock starts" },
  { key: "EDITING", label: "Editing", hint: "Cuts, audio, captions" },
  { key: "DELIVERED", label: "Delivered", hint: "Download & share" },
] as const;
export const STATUS_ORDER = ["PENDING_PAYMENT", "BOOKED", "ASSIGNED", "SHOOT_DONE", "EDITING", "DELIVERED"];
export const statusIndex = (s: string) => Math.max(0, STATUS_ORDER.indexOf(s) - 1);
export const STATUS_LABEL: Record<string, string> = { PENDING_PAYMENT: "Awaiting payment", BOOKED: "Booked", ASSIGNED: "Reeler assigned", SHOOT_DONE: "Shoot done", EDITING: "Editing", DELIVERED: "Delivered", CANCELLED: "Cancelled", REFUNDED: "Refunded" };
export const STATUS_TONE: Record<string, string> = { PENDING_PAYMENT: "text-orange", BOOKED: "text-cyan", ASSIGNED: "text-cyan", SHOOT_DONE: "text-pink", EDITING: "text-pink", DELIVERED: "text-lime", CANCELLED: "text-muted", REFUNDED: "text-muted" };
