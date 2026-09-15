# Graph Report - Tienda-Jhorce  (2026-09-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 233 nodes · 361 edges · 25 communities (12 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Catalog Domain
- Frontend Tooling
- Checkout and Payments
- TypeScript Configuration
- Storefront Experience
- Supabase Authentication
- Dev Dependencies
- API Boundaries
- App Runtime Config
- NPM Scripts
- Runtime Dependencies
- Backend Package
- TypeScript Environment
- PostCSS Pipeline

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `MockPaymentProvider` - 11 edges
3. `scripts` - 11 edges
4. `next` - 11 edges
5. `createMockCheckout()` - 9 edges
6. `useCart()` - 9 edges
7. `@phosphor-icons/react` - 9 edges
8. `react` - 9 edges
9. `SiteHeader()` - 8 edges
10. `ok()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `listProducts()`  [EXTRACTED]
  frontend/app/api/products/route.ts → backend/src/catalog/catalog-data.ts
- `CatalogPage()` --calls--> `listProducts()`  [EXTRACTED]
  frontend/app/catalogo/page.tsx → backend/src/catalog/catalog-data.ts
- `generateMetadata()` --calls--> `getProductBySlug()`  [EXTRACTED]
  frontend/app/producto/[slug]/page.tsx → backend/src/catalog/catalog-data.ts
- `ProductPage()` --calls--> `getProductBySlug()`  [EXTRACTED]
  frontend/app/producto/[slug]/page.tsx → backend/src/catalog/catalog-data.ts
- `POST()` --calls--> `createMockCheckout()`  [EXTRACTED]
  frontend/app/api/checkout/route.ts → backend/src/checkout/checkout-service.ts

## Import Cycles
- None detected.

## Communities (25 total, 2 thin omitted)

### Catalog Domain - "Catalog Domain"
Cohesion: 0.12
Nodes (20): getProductBySlug(), ProductCategory, PRODUCTS, StoreProduct, metadata, generateMetadata(), ProductPage(), CartContext (+12 more)

### Frontend Tooling - "Frontend Tooling"
Cohesion: 0.07
Nodes (24): zod, name, private, version, config, config, autoprefixer, eslint (+16 more)

### Checkout and Payments - "Checkout and Payments"
Cohesion: 0.14
Nodes (11): createMockCheckout(), calculateOrderTotal(), calculateShipping(), calculateSubtotal(), PriceLine, MockPaymentProvider, PaymentEvent, PaymentIntent (+3 more)

### TypeScript Configuration - "TypeScript Configuration"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Storefront Experience - "Storefront Experience"
Cohesion: 0.15
Nodes (8): listProducts(), CatalogPage(), metadata, metadata, CatalogView(), SiteFooter(), nextConfig, next

### Supabase Authentication - "Supabase Authentication"
Cohesion: 0.12
Nodes (16): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, @playwright/test, postcss, prisma (+8 more)

### Dev Dependencies - "Dev Dependencies"
Cohesion: 0.23
Nodes (7): metadata, metadata, LoginForm(), RecoverForm(), SignupForm(), createSupabaseBrowserClient(), react

### API Boundaries - "API Boundaries"
Cohesion: 0.36
Nodes (7): ApiError, fail(), ok(), catalogQuerySchema, POST(), POST(), GET()

### App Runtime Config - "App Runtime Config"
Cohesion: 0.18
Nodes (11): scripts, build, dev, e2e, lint, prisma:generate, prisma:migrate, start (+3 more)

### NPM Scripts - "NPM Scripts"
Cohesion: 0.22
Nodes (9): dependencies, next, @phosphor-icons/react, @prisma/client, react, react-dom, @supabase/ssr, @supabase/supabase-js (+1 more)

### Runtime Dependencies - "Runtime Dependencies"
Cohesion: 0.25
Nodes (7): dependencies, zod, description, zod, name, private, version

### Backend Package - "Backend Package"
Cohesion: 0.33
Nodes (4): dmSans, metadata, spaceGrotesk, CartProvider()

## Knowledge Gaps
- **95 isolated node(s):** `name`, `version`, `private`, `description`, `zod` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 136 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Storefront Experience` to `Catalog Domain`, `Frontend Tooling`, `Backend Package`, `Dev Dependencies`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Supabase Authentication` to `Frontend Tooling`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `react` connect `Dev Dependencies` to `Catalog Domain`, `Frontend Tooling`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Catalog Domain` be split into smaller, more focused modules?**
  _Cohesion score 0.12233285917496443 - nodes in this community are weakly interconnected._
- **Should `Frontend Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Checkout and Payments` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._