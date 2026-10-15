# Reelwala

**Aaspaas ka Reeler, 24 ghante me Reel.** A marketplace to book verified local reel makers for birthdays, weddings, parties, cafés and more. Shot today, edited Instagram reel delivered in 24 hours, from ₹999.

Built with Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, GSAP ScrollTrigger, React Three Fiber, Lenis, Prisma, NextAuth and Razorpay.

## Features

- **Homepage**: 3D hero with floating phones playing real reels, pinned "How it works", horizontal reel wall, Instagram-style fullscreen viewer, pricing, before/after edit slider, testimonials, FAQ, quick-book modal.
- **Booking flow** (`/book`): 6 animated steps, Leaflet map pin, live price card, availability and double-booking checks, coupons, 30% token or full payment via Razorpay (with a simulated gateway when keys are missing), confetti success page with timeline.
- **Quick book** (`/quick`): 60-second request, ops call back in 15 minutes.
- **Browse** (`/reelers`): filters (city, occasion, price, rating, date, style), sort, map view with glowing price pins, skeletons.
- **Reeler profile** (`/reelers/[slug]`): cover reel, portfolio viewer, reeler-specific package prices (±20% of base), availability calendar, verified reviews, sticky booking card / mobile bottom sheet, schema.org markup.
- **Edit-only** (`/edit`): drag-drop upload with shimmer progress, style/music/caption options, instant animated quote, tracking page.
- **Auth**: phone OTP (dev OTP `123456` until an SMS provider is configured) and Google (when keys exist). Roles: CUSTOMER, REELER, ADMIN.
- **Customer dashboard**: live status tracker with 24-hr delivery timer, shoot countdown, deliverables gallery, free revision, cancellation with policy-aware refunds, payments, referral code.
- **Reeler dashboard**: earnings chart, accept/decline requests with 30-min timer, mark shoot done / delivered, availability editor, portfolio manager, reviews, payouts (85%), profile completeness, verification status.
- **Reeler onboarding** (`/reeler/join`): earnings calculator, 5-step application, ID upload, UPI.
- **Admin** (`/admin`): KPIs, bookings table with assign/reassign and status control, reeler approvals with sample reel viewer, edit queue, payments, quick requests, coupons, cities and waitlists.
- **City SEO pages** (`/cities/[slug]`), legal pages, sitemap, robots.

## Setup

```bash
npm install
cp .env.example .env.local        # fill what you have; everything has a dev fallback
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma db push
npx prisma db seed                # 12 reelers across Delhi NCR, Mumbai, Jaipur + coupons + reviews
npm run dev
```

### Dev logins (OTP is always `123456` without an SMS provider)

| Role | Phone |
|---|---|
| Customer | any 10-digit number |
| Reeler | `9000000001` … `9000000012` |
| Admin | `9999999990` |

Coupons seeded: `FIRST100`, `REEL20`, `SHAADI500`.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite in dev (`file:./dev.db`). For production switch `provider` in `prisma/schema.prisma` to `postgresql` and point at Supabase/Neon. |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | NextAuth. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Enables "Continue with Google". |
| `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` | Real OTP SMS. Without them the OTP is `123456` and logged to the server. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Live checkout. Without them a "simulated" gateway marks payments paid. |
| `RAZORPAY_WEBHOOK_SECRET` | Verifies `/api/payments/webhook` (`payment.captured`, `payment.failed`, `refund.processed`). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number behind every WhatsApp button, e.g. `919876543210`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap. |

## Deploy to Vercel

1. Push to GitHub, import in Vercel.
2. Create a Postgres DB (Supabase/Neon), set `DATABASE_URL`, change the Prisma `provider` to `postgresql`, run `npx prisma db push && npx prisma db seed` once.
3. Add the env vars above. Set `NEXTAUTH_URL` to your domain.
4. In Razorpay, add the webhook `https://<domain>/api/payments/webhook` with the events listed above.
5. Build command `npm run build` (runs `prisma generate` via `postinstall`).

## Replacing placeholders before launch

- Sample reels are hot-linked Mixkit preview clips (`src/lib/data/videos.ts`). Replace with compressed self-hosted `webm`/`mp4` under 2 MB.
- Avatars come from pravatar. Replace with real reeler photos.
- Uploads are simulated client-side (`src/components/edit/UploadZone.tsx`). Wire UploadThing or Cloudinary signed uploads using the same progress callbacks.
- Notifications (WhatsApp/email) are logged to the console; plug Interakt/Twilio and Resend into the `TODO` points in the API routes.

## Project structure

```
prisma/              schema + seed
src/app/             routes (App Router) and API routes
src/components/      ui primitives, home sections, booking steps, dashboards, admin
src/lib/             data, pricing, razorpay, auth, otp, queries
src/store/           zustand stores (ui, booking draft)
```
