# byjhor Store

Jhorce is a Next.js App Router storefront prepared for a Colombian e-commerce operation. The codebase keeps the customer-facing application in `frontend/` and the domain, persistence, validation, and payment boundaries in `backend/`.

## Current delivery

The first increment contains:

- responsive storefront home, catalog, product detail, account and cart surfaces;
- persistent client cart with quantity controls and checkout handoff;
- local React Bits-style visual components isolated under `frontend/components/react-bits/`;
- MongoDB-backed customer authentication with verified email, secure sessions and password recovery;
- MongoDB admin workspace with a separate private username/password session, product CRUD, inventory editing and order status operations, plus a legacy Prisma planning schema for future relational imports;
- Zod input validation, consistent API responses, health check, product API, and a mock payment provider adapter;
- unit test coverage for pricing and a Playwright smoke flow scaffold;
- SEO metadata, sitemap and robots routes.

## Run locally

Requirements: Node.js 20+, a MongoDB connection provided by Vercel, and a verified Resend sender for customer email.

```bash
cd frontend
npm install
copy ..\\.env.example .env.local
npm run dev
```

The storefront runs at `http://localhost:3000`. It renders catalog demo data without a database, while account actions require MongoDB and transactional email configuration.

## MongoDB authentication

1. Add `MONGODB_URI` in Vercel. The integration already provides it for this project.
2. Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and make sure the sender domain is verified in Resend.
3. Set `NEXT_PUBLIC_SITE_URL` to the public production URL so email links return to the store.
4. Set the private `ADMIN_USERNAME` and `ADMIN_PASSWORD` credentials for the owner. They can then enter `/admin/login`; customer email accounts do not grant administrative access.

The admin session is stored separately in `MONGODB_ADMIN_SESSIONS_COLLECTION` and expires after eight hours. Changing either admin credential invalidates previous admin sessions after the next request. There is no admin password recovery by email; rotate the private variables in Vercel when access needs to change.

Passwords use salted `scrypt` hashes. Browser sessions and email links are opaque random tokens whose SHA-256 digests are stored in MongoDB. Existing Supabase accounts remain untouched, but cannot be migrated automatically because their password hashes are not exportable; invite those customers to register again after a separate, approved migration campaign.

## Tiempo real con Ably

1. Create a restricted Ably API key in the Ably dashboard and add it to Vercel as `ABLY_API_KEY`. Do not expose the root key or add this value to a `NEXT_PUBLIC_` variable.
2. The browser authenticates through `/api/realtime/token`, which issues a short-lived token with subscribe-only access to the catalog channel. The admin role also receives access to the private admin channel.
3. `catalog.updated` refreshes storefront server-rendered data. `order.created`, `order.updated`, and `payment.updated` refresh the admin dashboard. Existing checkout preview code does not publish an order event because it does not create a real order yet.

Ably is optional in local development. When `ABLY_API_KEY` is absent, the storefront and admin continue working without a realtime connection. Use one provider only; no Pusher dependency is required.

## Verification

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
```

The Playwright suite expects the dev server to be running or starts it automatically with `npm run dev -- --port 3000`.

## Architecture notes

- Prices and stock are server-owned. The checkout boundary recalculates line totals from catalog data and never trusts client totals.
- Payments use `PaymentProvider` and `MockPaymentProvider`; adding Wompi, ePayco, Stripe or MercadoPago means implementing the same adapter contract.
- Interrapidísimo is intentionally not integrated by API. `Shipment` stores carrier-agnostic tracking data and the UI points customers to the public tracking page.
- Expiring reservations, failed emails and retryable work are modeled as `Job` records in the legacy planning schema for a future Vercel Cron-compatible implementation.
- The catalog repository reads published products from MongoDB and falls back to the current local catalog only while the configured products collection is empty. Products created or edited in `/admin` use the same public product contract and become visible in the storefront after publication.
- Ably capabilities are intentionally narrow. Product and order mutation endpoints call `publishRealtimeEvent` only after a successful server-side write, so open storefronts and admin sessions refresh without exposing the root key.
