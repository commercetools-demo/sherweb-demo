# Features

Code-derived inventory of what this repo implements. Bullets and key file paths —
the mechanism lives in `docs/how-it-works.md`, the walkthrough in `docs/demo-script.md`.

_Last generated: 2026-09-02 by feature-doc._

Sherweb Demo is a Next.js 16 (App Router) B2B2C cloud-marketplace portal, built from
scratch for Sherweb (not a fork of `b2c-starter`, `b2b-starter`, `b2b2c-starter`, or any
other commercetools starter — its directory layout, auth model, and file count don't
match any of them, and the repo's single "Initial Sherweb B2B2C demo app" commit has no
scaffold lineage). It models Sherweb's real business: an MSP/reseller ("partner") buys
Microsoft 365, Azure, security and backup SaaS licenses on behalf of its own downstream
end-customers, through one consolidated cloud marketplace. Auth and cart mutations call a
real commercetools project; the catalog, dashboard, orders, clients and checkout screens
render in-file mock data instead of the matching live endpoints that exist alongside them
— each such gap is called out below rather than dressed up as complete.

## Authentication & Identity

- NextAuth credentials login authenticates against the commercetools Customer login
  endpoint (`apiRoot.login()`), not a local user store (`lib/commercetools/customers.ts`,
  `app/api/auth/[...nextauth]/route.ts`).
- Session carries a `role` (`partner` / `end-customer` / `admin`) and
  `businessUnitKey`/`businessUnitName`, read off the customer's `customer-b2b-fields`
  custom type at login and used to gate which portal nav items and dashboard views render
  (`app/api/auth/[...nextauth]/route.ts`, `components/layout/Sidebar.tsx`).
- Login screen has role-tabbed (Partner/MSP vs. End Customer) demo-account quick-fill
  buttons, and a "Sign in with Microsoft" button that is decorative only — no Azure AD
  provider is configured (`app/login/page.tsx`).

## Cloud Catalog & Product Detail

- Searchable, category- and vendor-filterable SaaS catalog: 9 products across 6
  categories (Productivity, Infrastructure, Security, Backup & DR, Business Apps,
  Professional Services) spanning Microsoft 365 (Basic/Standard/Premium), Microsoft 365
  Copilot, Azure Virtual Desktop, Dynamics 365 Sales, Bitdefender GravityZone, Microsoft
  Defender for Business, and Acronis Cyber Backup (`app/portal/catalog/page.tsx`).
- Per-product detail page with overview/features/tier-comparison tabs, a monthly-vs-annual
  billing term toggle, a seat/device quantity stepper with a live running total, and
  related-product cross-sell (`app/portal/catalog/[slug]/page.tsx`).
- The catalog and product-detail pages render a hardcoded in-file product list rather than
  querying the live commercetools Product Projections search, even though that endpoint
  exists and works (`lib/commercetools/products.ts`, `app/api/products/route.ts`) —
  stubbed.

## Cart & Checkout

- Client-side cart (`contexts/CartContext.tsx`) persisted to `localStorage`, surfaced as a
  slide-out `CartSidebar` and a full cart page with quantity edit and line removal
  (`components/cart/CartSidebar.tsx`, `app/portal/cart/page.tsx`).
- Cart create/add/remove/update-quantity actions are real commercetools Cart API calls via
  `/api/cart` (`app/api/cart/route.ts` → `lib/commercetools/cart.ts`) — but the product and
  variant IDs the UI passes in come from the mock catalog, not real commercetools product
  IDs, so these calls don't correspond to catalog items that actually exist in the
  project.
- Discount code entry (`NEWPARTNER15` for 15% off, `ANNUAL5` for 5% off annual plans) is
  validated against a hardcoded client-side allow-list, not the commercetools Cart
  Discounts/Discount Codes API, even though matching real discount codes are provisioned
  by the seed script (`contexts/CartContext.tsx`, `app/portal/cart/page.tsx`) — stubbed.
- Two-step checkout: a partner-only "assign this order to an end customer" step (picked
  from a hardcoded client list) followed by review/confirm. "Place Order" is a simulated
  1.5s delay that clears the cart and shows a static confirmation — it never calls the
  order-creation API or the commercetools Orders API, despite both existing
  (`app/portal/checkout/page.tsx`, `app/api/orders/route.ts`, `lib/commercetools/orders.ts`)
  — stubbed.

## Partner Portal Tools

- Role-aware dashboard: partner accounts see MRR, active-subscription count and client
  count; end-customer accounts see license count and personal spend
  (`app/portal/dashboard/DashboardClient.tsx`) — KPI figures and recent-order feed are
  static mock data.
- "My Clients" (partner-only): managed end-customer accounts with MRR, seat count, tier
  and their currently active products (`app/portal/clients/page.tsx`) — static mock data.
- Purchase Lists: named, reusable multi-product bundles (e.g. "Standard SMB Onboarding
  Package", "Enterprise Security Bundle") that add every line to the cart in one click for
  fast re-ordering across clients (`app/portal/purchase-lists/page.tsx`) — the bundle
  definitions are static mock data, but "Add All to Cart" does drive the real per-item
  cart-add flow.
- Order History with status and payment-status badges, plus invoice-download and reorder
  actions (`app/portal/orders/page.tsx`) — static mock data; not sourced from the
  commercetools Orders API despite a `getOrdersByCustomer` helper existing for it.

## commercetools Integration

- Client-credentials SDK client for the commercetools Composable Commerce API
  (`lib/commercetools/client.ts`).
- Customer login/lookup and Business Unit fetch helpers (`lib/commercetools/customers.ts`).
- Product Projections search/lookup and Category fetch helpers, exposed through
  `/api/products` (`lib/commercetools/products.ts`, `app/api/products/route.ts`).
- Cart create/get/add/remove/update-quantity helpers, exposed through `/api/cart`
  (`lib/commercetools/cart.ts`, `app/api/cart/route.ts`).
- Order lookup-by-customer and order-from-cart creation helpers, exposed through
  `/api/orders` (`lib/commercetools/orders.ts`, `app/api/orders/route.ts`).
- commercetools primitives modeled: **Business Units** for partner companies, a
  `customer-b2b-fields` **Customer custom type** carrying `role` / `businessUnitKey` /
  `partnerTier`, a `saas-license` **Product Type**, and relative **Cart Discounts** +
  **Discount Codes** for the two promo codes.

## Demo Data & Seed Tooling

- `scripts/seed.mjs` provisions a full matching commercetools project from scratch: the
  `saas-license` product type, 6 categories, 5 distribution/pricing channels, 2 stores
  (North America + EU), the `customer-b2b-fields` customer custom type, all 9 catalog
  products with multi-currency (USD/CAD/EUR) prices, 4 partner Business Units, 7 seeded
  Customers (4 partner, 3 end-customer), and 3 cart discounts — a non-code 10%-off-orders-
  over-$500 volume discount plus the `NEWPARTNER15` and `ANNUAL5` discount codes.
- Seed run is repeat-safe: 409/duplicate-field API responses are treated as "already
  exists" and skipped rather than failing the run (`scripts/seed.mjs`).
- Ships demo credentials for 3 partner accounts (TechPartner Inc., CloudSolutions MSP,
  Apex Technologies) and 2 end-customer accounts, all auto-fillable from the login screen
  (`app/login/page.tsx`, `scripts/seed.mjs`).

## Distinctive: partner-on-behalf-of-client ordering

The thing this repo has that no starter does: a two-role reseller flow where a
partner/MSP account shops the same catalog under its own negotiated pricing, can save a
purchase-list bundle for fast repeat onboarding, and explicitly assigns a cart to one of
its own end-customers at checkout — modeling how an MSP buys and consolidates cloud
licenses for downstream clients on a single invoice. Driven by the customer's
`role`/`businessUnitKey` custom fields together with commercetools Business Units
(`app/portal/checkout/page.tsx`, `lib/commercetools/customers.ts`,
`app/api/auth/[...nextauth]/route.ts`).

## Branding & Deployment

- Marketing landing page (`/`) — hero, trust/vendor badges, featured-product grid, feature
  grid, and CTA sections — separate from the authenticated `/portal` app
  (`app/page.tsx`).
- Sherweb brand (navy `#1B2B5E`, sky blue `#00A9E0`, orange CTA `#FF6600`) is applied via
  inline hex styles throughout the marketing page, login screen, and portal chrome; there
  is no shared design-token file or component library (`app/page.tsx`, `app/login/page.tsx`,
  `components/layout/*`).
- Deploys to Netlify via `@netlify/plugin-nextjs` (`netlify.toml`); production build
  ignores TypeScript and ESLint errors (`next.config.ts`).
