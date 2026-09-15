# Jhorce Store

Jhorce is a Next.js App Router storefront prepared for a Colombian e-commerce operation. The codebase keeps the customer-facing application in `frontend/` and the domain, persistence, validation, and payment boundaries in `backend/`.

## Current delivery

The first increment contains:

- responsive storefront home, catalog, product detail, login and cart surfaces;
- persistent client cart with quantity controls and checkout handoff;
- local React Bits-style visual components isolated under `frontend/components/react-bits/`;
- Supabase Auth browser client and an explicit auth-ready login screen;
- Prisma schema for catalog, inventory, checkout, payments, orders, shipments, promotions, reviews, returns, jobs and audit logs;
- Zod input validation, consistent API responses, health check, product API, and a mock payment provider adapter;
- unit test coverage for pricing and a Playwright smoke flow scaffold;
- SEO metadata, sitemap and robots routes.

## Run locally

Requirements: Node.js 20+ and a Supabase project for the database/auth phases.

```bash
cd frontend
npm install
copy ..\\.env.example .env.local
npm run dev
```

The storefront runs at `http://localhost:3000`. It renders catalog demo data without a database, so the visual flow can be reviewed before connecting Supabase.

## Supabase and Prisma

1. Create a Supabase project and copy the values into `frontend/.env.local`.
2. Set `DATABASE_URL` to the Supavisor pooled connection and `DIRECT_URL` to the direct connection.
3. From `frontend/`, run `npm run prisma:generate` and `npm run prisma:migrate` when the database is ready.
4. Enable email/password auth and email confirmation in Supabase Auth.

Authentication is delegated to Supabase Auth. Prisma models `UserProfile` records separately because Supabase owns password hashing, refresh tokens, email verification and recovery flows.

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
- Expiring reservations, failed emails and retryable work are modeled as `Job` records for Vercel Cron/Supabase-compatible processing.
- The current product data is demo data. The API and schema boundaries are ready to swap to Supabase/Prisma-backed repositories in the next increment.

