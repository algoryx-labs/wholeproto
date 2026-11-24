# Calgary Wholesale — Client Prototype Brief

**Goal:** A clickable, frontend-only Next.js monorepo that demos three connected products for a multi-warehouse grocery wholesaler (Ontario). Show the client a premium experience with realistic data — no backend, no real auth, no live APIs.

---

## Business

Calgary Wholesale sells groceries through two channels from shared warehouses:

| Channel | Who | How they buy |
|---|---|---|
| **B2B** | Grocery stores, restaurants, cafés | By the **case**, credit terms, price groups |
| **B2C** | Consumers | By the **unit**, scheduled delivery slots |

**Admin** is the Cin7-style control plane: inventory across all warehouses, product listings for both channels, pricing, B2B accounts, and all orders.

**Warehouses (demo):** Mississauga Distribution Centre (MDC), Brampton Warehouse (BRW), Etobicoke Cross-Dock (ETX), Hamilton Depot (HMD).

**Currency / tax:** CAD, HST 13%, Canadian spelling (Centre, colour).

---

## Monorepo

```
apps/
  admin/    # Staff console — inventory, catalog, orders, customers, reports  :3000
  b2b/      # Calgary Wholesale Cash N Carry — wholesale buyer portal                        :3001
  mobile/   # Calgary Wholesale — consumer app inside a phone frame on desktop        :3002
packages/
  ui/       # Design system + shared composites
  data/     # Types, seeded mock data, mock API fetchers
  lib/      # Brand constants, formatters, cn()
```

Shared brand strings live in one constants file so renaming is instant.

---

## App 1 — Admin (Cin7-style)

**Users:** Calgary Wholesale staff with role simulation (Owner, Operations, Warehouse staff, Sales, Accountant, Support).

**Must demo:**
- Multi-warehouse **stock matrix** (product × warehouse cells with health colours)
- Stock transfers between warehouses + receive flow that updates inventory
- Product listing management (create/edit, categories, images, B2B + mobile visibility)
- Price groups / tiers / promotions reflected on Trade + app
- Orders for **both** B2B and mobile (status board, detail, warehouse assignment)
- B2B account management (credit, terms, approve new accounts)
- App customers + **storefront** section (banners, featured collections) that drives the mobile home
- Low-stock alerts, reports (CSV export), QuickBooks sync UI (mocked)
- Users & roles with a permission matrix

**Layout:** Collapsible sidebar, ⌘K search, warehouse scope switcher, notifications, DemoSwitcher to jump to Trade / mobile.

---

## App 2 — B2B portal (Calgary Wholesale Cash N Carry)

**Users:** Wholesale buyers (demo: Lakeshore Fresh Grocers).

**Must demo:**
- Catalog with case pricing, tier hints, live stock dots per warehouse
- Quick order (SKU rows, paste, CSV upload)
- Saved order lists / buy again / reorder
- Cart + checkout (location, delivery date, PO, Net terms; Buyer over limit → `pending_approval`)
- Orders + invoices + account / team members

Connected to Admin: same products, stock, price groups, and orders (e.g. `WW-B-10482`).

---

## App 3 — B2C mobile app

**Users:** Consumers ordering groceries.

**Must demo:**
- On desktop: **phone-only chrome** (390×844); on real phones: full screen
- Browse home (banners from Admin storefront), categories, search, product detail
- Cart, promo `FRESH10`, delivery slot picker, checkout, success animation
- Order tracking that advances live for the demo
- Account (addresses, favourites, help)

Connected to Admin: same catalog (unit prices), promotions/banners, and mobile orders appear under Admin Orders with an App channel badge.

---

## Tech (frontend only)

- Turborepo + pnpm, Next.js App Router, React 19, TypeScript strict
- Tailwind v4 + shadcn/ui in `packages/ui`
- Mock data + React Query delays; Zustand persist for carts / edits
- Premium light theme: evergreen primary, stock-health as the signature visual
- No lorem ipsum; realistic Ontario grocery copy

---

## Demo story (client meeting)

1. **Admin** — low-stock Honeycrisp; create Brampton → Mississauga transfer; show inventory update after receive.
2. **Admin** — publish a new product to B2B + mobile; show live listing preview.
3. **Trade** — Lakeshore catalog with live stock; place order (approval if over limit).
4. **Admin** — fulfil that B2B order on the board; QuickBooks synced badge.
5. **Mobile** — browse → `FRESH10` → checkout → live tracking.
6. **Admin** — same app order in Orders; export a sales CSV.

---

## Acceptance (prototype)

- [ ] `pnpm dev` runs all three apps
- [ ] Admin inventory feels Cin7-like across 4 warehouses
- [ ] B2B and mobile listings/orders are manageable from Admin
- [ ] Stock / prices / orders feel connected via shared seed data
- [ ] Premium UI: loading skeletons, empty states, toasts, CAD + HST

**Out of scope for this prototype:** real backend, real payments, real QuickBooks, real SMS OTP, production auth.
