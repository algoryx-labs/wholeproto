# Westwinds Wholesale — Frontend Prototype Monorepo
### Build brief for Cursor (frontend only, mock data, client demo)

---

## 0. Your role and the goal

You are a senior frontend engineer with a strong product-design eye. Build a **clickable, frontend-only prototype** of three connected products for **Westwinds Wholesale**, a grocery wholesaler in Ontario, Canada. It will be shown to the client in a sales/approval meeting, so it must *feel like a finished product*: realistic data, smooth interactions, loading states, empty states, and a premium light UI.

There is **no backend, no database, no real auth, no real API calls**. Every screen runs on deterministic mock data and client-side state. Structure the code so a real API can replace the mock layer later without rewriting screens.

The three apps:

| App | Folder | Who uses it | Port |
|---|---|---|---|
| Westwinds Admin | `apps/admin` | Westwinds staff: inventory across all warehouses (Cin7-style), products & listings, pricing, B2B + B2C orders, customers, reports, users & roles | 3000 |
| Westwinds Trade (B2B portal) | `apps/b2b` | Wholesale customers (grocery stores, restaurants, cafés) placing case orders | 3001 |
| Westwinds (B2C app) | `apps/mobile` | Consumers ordering groceries from their phone. Rendered **inside a phone frame** on desktop | 3002 |

Put all brand strings (company name, app names, support email, phone) in one constants file so they can be renamed in seconds.

---

## 1. Business context (use this to make content realistic)

- Westwinds runs **4 warehouses** in Ontario: Mississauga Distribution Centre (main), Brampton Warehouse, Etobicoke Cross-Dock, Hamilton Depot.
- B2B customers buy **by the case**, have **price groups / tiered pricing**, **credit limits**, **Net 15 / Net 30 terms**, multiple store locations, and multiple staff users with different permissions.
- B2C customers buy **by the unit** through the mobile app with scheduled delivery slots.
- Currency is **CAD**. Format with `Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })`. Tax is **HST 13%**. Dates like `Sep 14, 2026`. Use Canadian spelling where natural (Centre, colour, cheque).
- The prototype must visibly demonstrate every feature promised in the client's quotation:
  - Inventory management across all locations
  - Multi-location stock transfers
  - Online B2B ordering portal (catalog, order history, repeat ordering, account management, real-time stock visibility per location)
  - Admin panel with **role-based login and configurable permissions**
  - Order management for B2B and mobile orders
  - Product listing management (add, edit, categorize, remove, images, descriptions, availability)
  - Price management (prices, offers, discounts) reflected on the apps
  - Low-stock alerts
  - Reporting (stock movement, sales, account activity)
  - **QuickBooks API integration** (mocked UI: connection status, sync settings, sync log)
  - Client mobile app: browse, cart, checkout, order tracking, order history

---

## 2. Tech stack

Use the latest stable versions at install time. Do not add libraries beyond this list without a clear reason.

- **Monorepo:** Turborepo + pnpm workspaces
- **Framework:** Next.js (latest stable, App Router, React 19, TypeScript strict)
- **Styling:** Tailwind CSS v4 (CSS-first config with `@theme`)
- **Components:** shadcn/ui (Radix primitives), set up using shadcn's monorepo layout so components live in `packages/ui`
- **Icons:** lucide-react (never emoji as icons)
- **Motion:** `motion` (import from `motion/react`)
- **Tables:** @tanstack/react-table
- **Data fetching (mocked):** @tanstack/react-query, with fetchers that return mock data after a simulated delay
- **Client state:** zustand with `persist` middleware (cart, created orders, transfers, edits), storage keys prefixed per app (`ww-admin:*`, `ww-b2b:*`, `ww-mobile:*`)
- **URL state for filters:** nuqs
- **Forms:** react-hook-form + zod
- **Charts:** shadcn chart components (Recharts)
- **Toasts:** sonner
- **Command palette:** cmdk (via shadcn `Command`)
- **Drawers / bottom sheets:** vaul (via shadcn `Drawer`)
- **Carousels:** embla-carousel (via shadcn `Carousel`)
- **Dates:** date-fns + shadcn `Calendar`
- **CSV parse/export:** papaparse
- **Seeded fake data:** @faker-js/faker with `faker.seed(2026)` and the `en_CA` locale (for people, addresses, phone numbers only; product names are hand-written, see §5)

---

## 3. Monorepo structure

```
westwinds/
├─ apps/
│  ├─ admin/                 # Next.js app, port 3000
│  │  └─ src/
│  │     ├─ app/             # routes (see §6)
│  │     ├─ components/      # admin-only components
│  │     ├─ stores/          # zustand stores
│  │     └─ lib/             # permissions, nav config
│  ├─ b2b/                   # Next.js app, port 3001
│  └─ mobile/                # Next.js app, port 3002
│     └─ src/
│        ├─ app/
│        ├─ components/
│        │  └─ phone-frame/  # device frame + context (see §8.1)
│        └─ stores/
├─ packages/
│  ├─ ui/                    # @westwinds/ui — shadcn components + shared composites + globals.css with tokens
│  ├─ data/                  # @westwinds/data — types, seeded datasets, mock API fetchers
│  ├─ lib/                   # @westwinds/lib — cn(), formatCurrency, formatDate, formatQty, sleep, brand constants
│  ├─ eslint-config/
│  └─ typescript-config/
├─ turbo.json
├─ pnpm-workspace.yaml
└─ package.json
```

Root scripts:

```json
{
  "dev": "turbo dev",
  "dev:admin": "turbo dev --filter=admin",
  "dev:b2b": "turbo dev --filter=b2b",
  "dev:mobile": "turbo dev --filter=mobile",
  "build": "turbo build",
  "lint": "turbo lint",
  "typecheck": "turbo typecheck"
}
```

Setup requirements:
- Each app's `next.config` must include `transpilePackages: ['@westwinds/ui', '@westwinds/data', '@westwinds/lib']`.
- Tailwind v4 must scan the shared package: in each app's global CSS, import the shared stylesheet and add an `@source` directive pointing at `packages/ui/src`, otherwise shared component classes will be missing.
- App URLs come from env vars (`NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_B2B_URL`, `NEXT_PUBLIC_MOBILE_URL`) with localhost defaults, so the demo can be deployed to Vercel as three projects from one repo.

---

## 4. Design system (light theme only, premium feel)

### 4.1 Direction

The product world is fresh food moving through warehouses. The look should feel **calm, precise and fresh**: crisp near-white surfaces with a faint green cast, a deep evergreen primary, and produce colours used only where they carry meaning (categories, stock health, offers). Quality bar: the polish of Linear or Stripe's dashboard for Admin and B2B, and the tactile smoothness of a modern quick-commerce app for mobile. Do **not** copy any other brand's visuals.

The one signature element across all three apps is **stock health**: a consistent visual language (dots, bars, heat-tinted cells) that shows availability per warehouse. Make that component excellent and reuse it everywhere. Keep everything around it quiet.

### 4.2 Tokens

Define these in `packages/ui/src/styles/globals.css` as CSS variables mapped through Tailwind v4 `@theme`. Override shadcn's default variables so nothing looks like stock shadcn.

```css
:root {
  --background: #F6F8F6;        /* page, faint green-grey */
  --surface: #FFFFFF;           /* cards, tables, sheets */
  --surface-sunken: #EEF2EF;    /* table headers, input fills, tab tracks */
  --foreground: #0E1A15;        /* primary text */
  --muted-foreground: #5B6B63;  /* secondary text */
  --subtle-foreground: #8A978F; /* placeholders, meta */
  --border: #E1E7E3;
  --border-strong: #CBD5CF;

  --primary: #0B5D45;           /* evergreen */
  --primary-hover: #094D39;
  --primary-soft: #E3F1EB;      /* selected rows, active nav */
  --primary-foreground: #FFFFFF;

  --offer: #E0890B;             /* discounts, deals (citrus) */
  --offer-soft: #FDF1DC;

  --success: #13795B;  --success-soft: #E0F4EC;   /* in stock, delivered */
  --warning: #B25E09;  --warning-soft: #FCEFD9;   /* low stock, pending */
  --danger:  #C0342B;  --danger-soft:  #FBE6E4;   /* out of stock, overdue */
  --info:    #2458B8;  --info-soft:    #E4ECFA;   /* in transit, processing */

  --ring: #0B5D45;
  --radius-sm: 8px;    /* inputs, buttons, badges */
  --radius-md: 12px;   /* cards, popovers */
  --radius-lg: 20px;   /* sheets, dialogs, mobile cards */
  --shadow-card: 0 1px 2px rgba(14, 26, 21, 0.04), 0 2px 8px rgba(14, 26, 21, 0.04);
  --shadow-pop: 0 8px 28px rgba(14, 26, 21, 0.10), 0 2px 6px rgba(14, 26, 21, 0.06);
}
```

Category tint palette (used for product image placeholders and category tiles only):
Produce `#DDF0D5`, Dairy & Eggs `#E6EEF9`, Bakery `#F6E8D4`, Meat & Seafood `#F8E1DF`, Beverages `#DDEEF0`, Snacks `#FBEBD0`, Pantry `#EFE8DB`, Frozen `#E3ECF7`, Household `#ECE8F4`, Personal Care `#F4E4EC`.

Use radius by hierarchy (small controls 8px, cards 12px, sheets 20px), not one radius on everything. Use borders more than shadows; reserve `--shadow-pop` for floating layers.

### 4.3 Typography

- **UI and data:** Inter via `next/font/google`, chosen for its tabular figures. Apply `font-variant-numeric: tabular-nums` to every price, quantity, KPI and table number column.
- **Display:** Bricolage Grotesque via `next/font/google`, used only for page titles, KPI values, the mobile home greeting and product names on the mobile product page. Letter-spacing `-0.02em` on display sizes.
- Scale: 12 / 13 / 14 (base for admin and B2B) / 16 (base for mobile) / 18 / 22 / 28 / 36.
- Sentence case everywhere. No all-caps eyebrow labels, no `→` appended to buttons, no text strings joined with middle dots.

### 4.4 Shared composites in `packages/ui`

Build these once and reuse them:

- `Logo` (simple wordmark + a lucide icon mark; no external image)
- `PageHeader` (title, description, actions slot, optional breadcrumbs)
- `StatCard` (label, value with count-up animation on first render, delta vs previous period, optional sparkline)
- `DataTable` (TanStack: sorting, column visibility, row selection, pagination, sticky header, density toggle, skeleton rows, empty state)
- `StatusBadge` (maps every status enum in §5 to a colour token and an icon)
- `StockHealth` (the signature component): variants `dots` (one dot per warehouse with tooltip showing qty), `bar` (on-hand vs reorder point), `cell` (tinted table cell)
- `Money` and `Qty` (formatted, tabular)
- `ProductImage` (renders `product.image` if present; otherwise a category-tinted tile with a category icon and the product's initial. Never hotlink random internet image URLs)
- `EmptyState` (icon, one-line explanation, primary action)
- `FilterBar` (search, faceted filters, date range with presets, active filter chips, clear all)
- `Timeline` (status history for orders and transfers)
- `QuantityStepper` (min, max, step; case vs unit labels)
- `KeyValueList`, `SectionCard`, `ConfirmDialog`
- `DemoSwitcher` (see §9)

---

## 5. Shared mock data (`packages/data`)

### 5.1 Types (export all)

`Warehouse`, `Category`, `Product`, `StockLevel`, `StockMovement`, `Transfer`, `TransferLine`, `B2BCustomer`, `B2BUser`, `PriceGroup`, `PriceTier`, `Promotion`, `Banner`, `Order` (discriminated by `channel: 'b2b' | 'b2c'`), `OrderLine`, `Invoice`, `Consumer`, `Address`, `AdminUser`, `Role`, `Permission`, `ActivityEvent`, `QuickBooksSyncLog`, `DailySales`.

### 5.2 Status enums

- B2B order: `pending_approval`, `confirmed`, `picking`, `packed`, `shipped`, `delivered`, `cancelled`
- B2C order: `placed`, `confirmed`, `packed`, `out_for_delivery`, `delivered`, `cancelled`
- Transfer: `draft`, `requested`, `in_transit`, `partially_received`, `received`, `cancelled`
- Invoice / payment: `paid`, `unpaid`, `partially_paid`, `overdue`
- Stock health: `in_stock`, `low_stock`, `out_of_stock`
- Stock movement type: `received`, `sold_b2b`, `sold_b2c`, `transfer_out`, `transfer_in`, `adjustment_damaged`, `adjustment_expired`, `adjustment_count`, `return`
- Product status: `draft`, `active`, `archived`; channel visibility flags `visibleOnB2B`, `visibleOnMobile`

### 5.3 Datasets (deterministic, seeded)

- **Warehouses:** the 4 listed in §1, each with code (MDC, BRW, ETX, HMD), address, manager name, capacity %, zones.
- **Products:** ~80 **hand-written, realistic** grocery items across the 10 categories (e.g. "Honeycrisp apples", "2% milk 4 L", "Sourdough loaf 675 g", "Basmati rice 10 kg", "Sparkling water lemon 12 × 355 mL"). Each has: SKU (`WW-PRD-10231` style), UPC, brand, unit size, case pack (e.g. `12 × 500 g`), B2C price, optional B2C compare-at price, B2B case price, B2B tier table (1–9 cases, 10–49, 50+), cost, reorder point per warehouse, tags, description, status, channel flags.
- **Stock levels:** per product per warehouse: on hand, allocated, available, bin location. Seed roughly 70% healthy, 20% low, 10% out, spread unevenly across warehouses so transfers make sense.
- **Stock movements:** 90 days of history.
- **Transfers:** ~35 across all statuses, `TRF-00xxx`.
- **B2B customers:** 25 fictional businesses (e.g. "Lakeshore Fresh Grocers", "Maple Crossing Mini Mart", "Harbour Street Café", "Northgate Foods Co-op"), each with account number, price group (Standard, Silver, Gold), credit limit, balance, terms, 1–4 delivery locations, 1–4 users with roles (Account admin, Buyer, Approver), status (active, pending approval, on hold).
- **Consumers:** 60 with addresses in the GTA and Hamilton.
- **Orders:** ~180 total (about 60% B2B, 40% B2C) over the last 90 days, `WW-B-10xxx` and `WW-C-20xxx`, with realistic line counts, assigned warehouse, status history timestamps, payment status, and a `quickbooksSyncedAt` field for B2B invoices.
- **Invoices:** one per delivered or shipped B2B order.
- **Promotions & banners:** 6 promotions (percent off, fixed off, buy-X-get-Y, B2B volume deal), 4 mobile home banners with headline copy and a tint colour.
- **Admin users:** 12, across roles.
- **Roles & permissions:** Owner, Operations manager, Warehouse staff (scoped to one warehouse), Sales manager, Accountant, Support. Permissions matrix of modules (Dashboard, Orders, Products, Pricing, Inventory, Transfers, Warehouses, Customers, Reports, Integrations, Users & roles, Settings) × actions (view, create, edit, delete, approve).
- **Daily sales series:** 90 days split by channel, with a weekly rhythm and a mild upward trend.
- **Activity events:** 200 audit entries ("Priya S. approved transfer TRF-00412").
- **QuickBooks sync log:** 30 entries (invoices, payments, customers) with a few warnings.

Keep IDs consistent across apps so one demo story works everywhere: the B2B demo login is **Lakeshore Fresh Grocers**, and its latest order `WW-B-10482` must also appear in Admin.

### 5.4 Mock API

`packages/data/src/api/*.ts` exposes async functions (`getProducts(filters)`, `getOrder(id)`, `getStockMatrix(filters)`, etc.) that wait a random 300–700 ms and return data. Apps call them through React Query hooks. Mutations update the app's zustand store and invalidate queries, so created orders, edited products and received transfers show up immediately on other screens of the same app.

Note: the three apps run on different origins, so their persisted state is independent. Cross-app consistency comes from the shared seed data, which is enough for the demo.

---

## 6. App 1 — Westwinds Admin (`apps/admin`)

### 6.1 Layout

- **Collapsible left sidebar** with grouped navigation: Overview (Dashboard), Sales (Orders), Catalog (Products, Categories, Pricing, Promotions, App storefront), Inventory (Stock levels, Transfers, Adjustments, Warehouses), Customers (B2B accounts, App customers), Insights (Reports, Activity log), Settings (Integrations, Users & roles, Settings). Show count badges on Orders (pending) and Stock levels (low stock).
- **Top bar:** global search opening a ⌘K command palette (search products, orders, customers, and jump to pages), a **warehouse scope switcher** ("All warehouses" or one warehouse; filters dashboard, inventory and orders), notifications popover (low stock, new B2B account requests, sync warnings), user menu.
- **Role simulation:** the user menu contains "View as role" with the six roles. Switching role changes the sidebar (hidden modules), disables restricted actions with a tooltip explaining which role can do it, and scopes Warehouse staff to their warehouse. This is how we demo role-based login.
- Designed for 1280–1600px wide; must stay usable at 1024px (sidebar collapses to icons).

### 6.2 Routes and screens

**`/login`**
Split layout: left side is the sign-in form (email and password prefilled with a demo account, "Remember me", "Forgot password" opens a dialog); right side is a quiet brand panel with a live-looking stock health illustration built from the `StockHealth` component. Below the form, quick-pick chips to sign in as each role. Any password works; show a 600 ms loading state, then go to the dashboard.

**`/` Dashboard**
- Greeting with today's date and the current warehouse scope.
- KPI row: revenue today, revenue month to date (split B2B vs app), open orders, orders awaiting approval, low-stock SKUs, inventory value.
- Charts: sales over time (area chart, channel toggle, 7/30/90-day tabs); orders by status (bar); stock health by warehouse (stacked bar of in/low/out); top 5 products by revenue.
- Panels: low-stock alerts list with "Create transfer" and "Mark reordered" actions; latest orders table (8 rows); pending B2B account requests; recent activity feed; QuickBooks sync status card.

**`/orders`**
- Tabs: All, B2B, App, plus status tabs with counts.
- Toggle between **table view** (order #, channel badge, customer, warehouse, items, total, payment, status, placed at) and **board view** (kanban columns by fulfilment status; dragging a card advances status with an optimistic update and a toast).
- Filters: date range, warehouse, payment status, customer, amount range. Bulk actions: assign warehouse, mark picked, export CSV (real client-side CSV).

**`/orders/[id]`**
- Header with order number, channel, status badge and a primary action that advances the status ("Confirm order", "Start picking", "Mark packed", "Mark shipped" / "Out for delivery", "Mark delivered"); secondary actions: cancel, print packing slip (opens a print-styled dialog), resend confirmation.
- Line items table with ordered qty, picked qty (editable during picking), unit/case price, tier discount, line total.
- **Warehouse assignment card:** dropdown listing each warehouse with `StockHealth` availability for this order; if the chosen warehouse can't fulfil everything, show a warning with "Split shipment" and "Request transfer" actions.
- Customer card (B2B: account, terms, credit used; App: contact and delivery slot), delivery address, payment and invoice card (B2B shows "Synced to QuickBooks" with time), internal notes, status `Timeline`.

**`/products`**
- Table with image, name, SKU, category, B2C price, B2B case price, total stock with `StockHealth` dots, channels (B2B / App chips), status. Grid view toggle. Filters: category, status, channel, stock health, brand. Bulk: publish, unpublish from a channel, archive, change category.

**`/products/new` and `/products/[id]`**
A tabbed editor with a sticky save bar ("Save changes" / "Discard"), unsaved-changes guard, and a **live listing preview panel** on the right that shows how the product appears as a mobile app card and as a B2B catalog row, updating as you type.
- *General:* name, brand, category, description (rich text lite: bold, lists), tags, UPC, auto-generated SKU.
- *Media:* drag-and-drop upload with instant local previews (`URL.createObjectURL`), reorder by drag, set cover image.
- *Pricing:* B2C price and compare-at price, B2B case price, case pack, editable tier table, per price group overrides, margin calculator from cost.
- *Inventory:* per-warehouse on hand (read-only, links to adjustments), reorder point, reorder quantity, bin location.
- *Availability:* status (Draft / Active / Archived), visible on B2B portal toggle, visible on mobile app toggle, "Out of stock behaviour" (hide / show as sold out).
- Validation with zod, inline errors, success toast "Product saved".

**`/categories`**
Tree list with drag-to-reorder, product counts, category tint and icon picker, create/rename/delete dialogs.

**`/pricing`**
Price groups (Standard, Silver, Gold) with default discount %, assigned customers count, and a per-product override table with inline editing. A "Bulk price update" dialog (by category, by %, preview of changes before applying).

**`/promotions`**
List of offers with type, channel(s), schedule, usage, status. Create/edit sheet with type-specific fields, date range, eligible products or categories, channel targeting (App, B2B, both), and a preview of the badge as it will appear.

**`/storefront`** (mobile app content)
Manage home banners (reorder, schedule, preview in a small phone mockup), featured collections, and which categories appear on the app home, in what order.

**`/inventory`** — Stock levels, the Cin7-style core screen
- **Matrix table:** product, SKU, one column per warehouse (tinted `StockHealth` cells showing available qty, hover shows on hand / allocated / bin), total, allocated, available, reorder point, health status.
- Filters: category, health, warehouse, search. Toggle between "Available" and "On hand" numbers.
- Row actions: Adjust stock, Transfer, View history. Bulk: "Create transfer from selected".
- Summary strip above the table: total SKUs, low, out, inventory value for the current scope.

**`/inventory/[sku]`**
Product stock header, per-warehouse breakdown cards, movement history table (type, qty +/-, warehouse, reference link to order or transfer, user, time), and a 90-day on-hand line chart per warehouse.

**`/inventory/adjustments`**
History list plus "New adjustment" dialog: warehouse, product, reason (damaged, expired, count correction, return), qty change, note. Shows before and after values.

**`/transfers`**
Table and status tabs. Columns: transfer #, from → to (render as two warehouse chips with an arrow icon), lines, units, status, requested by, expected date.

**`/transfers/new`** — three-step flow
1. Choose source and destination (cannot be the same; show each warehouse's health summary).
2. Add items: product search, shows available qty at source; qty cannot exceed available (inline error); a "Suggest items" button pre-fills products that are low at destination and healthy at source.
3. Review: carrier/driver, expected arrival date, notes. "Request transfer" creates `TRF-00xxx` in `requested` and routes to its detail page.

**`/transfers/[id]`**
Timeline, line items, and role-gated actions: Approve, Mark in transit, **Receive** (dialog to enter received qty per line; discrepancies flagged and status becomes `partially_received` if short). Receiving updates stock levels in the store so `/inventory` reflects it.

**`/warehouses` and `/warehouses/[id]`**
Cards with address, manager, capacity bar, SKU count, health breakdown. Detail page: zones/bins table, stock on hand, open transfers in and out, recent orders fulfilled from there.

**`/customers/b2b`**
Accounts table (company, account #, price group, credit used vs limit as a bar, balance, terms, last order, status). "Requests" tab to approve or reject new account applications (approval dialog sets price group, credit limit, terms).

**`/customers/b2b/[id]`**
Overview (contacts, locations, terms, credit), orders, invoices, portal users with roles, pricing (group and overrides), activity. Actions: put on hold, change credit limit, send portal invite.

**`/customers/app`**
Consumer list with orders count, lifetime spend, last order; detail sheet with addresses and order history.

**`/reports`**
Tabs: Sales (by channel, category, product, customer), Stock movement (by type and warehouse), Account activity (B2B logins, orders, top accounts). Each tab: date range with presets (Today, Last 7 days, Last 30 days, This quarter, Custom), charts, a detailed table, and "Export CSV" that actually downloads a CSV.

**`/integrations`**
QuickBooks Online card showing "Connected" with company name and last sync time, "Sync now" button (animated progress over ~2 s then success toast), sync settings toggles (invoices, payments, customers, products, sync frequency), account mapping table (sales income, HST payable, AR), and the sync log table with a warning row that opens a detail sheet. Use the name QuickBooks in text with a generic lucide icon, not their logo. Add greyed "coming soon" cards for other integrations only if it helps the story.

**`/users`**
Users table (name, email, role, warehouse scope, last active, status), invite user dialog, edit role sheet.

**`/roles`**
Role list on the left; on the right a **permission matrix** (modules × view/create/edit/delete/approve checkboxes) with "Duplicate role" and "Create role". Changes persist in the store and immediately affect the "View as role" simulation.

**`/activity`**
Audit log with filters (user, module, date) and grouped by day.

**`/settings`**
Company profile, tax settings (HST 13%), order number prefixes, low-stock alert thresholds and recipients, notification preferences.

---

## 7. App 2 — Westwinds Trade, B2B portal (`apps/b2b`)

### 7.1 Layout

Top navigation bar (logo, Catalog, Quick order, Order lists, Orders, Invoices), search field that opens a product command palette, account switcher showing the company and delivery location, cart button with count and total. A thin account strip under the nav shows the price group and available credit. Designed for desktop first, fully usable on tablet, acceptable on phone.

### 7.2 Routes and screens

**`/login`**
Clean sign-in with prefilled demo buyer for Lakeshore Fresh Grocers. Link to **`/request-access`**: a multi-step application form (business details, HST number, locations, expected monthly volume, contact) ending in a "We'll review your application within 1 business day" confirmation.

**`/` Dashboard**
- Company header with account number and assigned sales rep contact.
- Credit widget: limit, used, available (bar), next payment due.
- "Buy again": last order's items with one-click "Add all to cart".
- Recent orders (status badges, reorder button), open invoices with due dates and overdue highlighting, saved order lists, and an announcement banner (e.g. holiday delivery schedule).

**`/catalog`**
- Left filter rail: categories, brands, availability at a chosen warehouse, "On promotion", "Previously ordered".
- Default **table view** (dense, fast for buyers): image, product, SKU, pack size, your case price (with strike-through base price if the price group discounts it), tier hint ("$2.10 less per case at 10+"), availability via `StockHealth` dots per warehouse with a "Live" indicator, quantity stepper and "Add".
- Grid view toggle, sort (relevance, name, price, most ordered), pagination or infinite scroll.
- **Simulated real-time stock:** every 8–12 s, nudge a few availability numbers and briefly highlight the changed cell, so stock visibility feels live.

**`/catalog/[sku]`**
Image gallery, description, pack details, **tier pricing table with the customer's active tier highlighted**, availability per warehouse table, quantity stepper with running total, "Add to order list", related products, and "You ordered this 4 times in the last 90 days" history.

**`/quick-order`**
Three ways to build an order fast: (1) SKU + qty rows with autocomplete, (2) paste from a spreadsheet ("SKU, qty" per line) with parse results showing matched, unmatched and out-of-stock lines, (3) CSV upload (papaparse) with the same validation table. "Add valid lines to cart".

**`/lists` and `/lists/[id]`** (repeat ordering)
Saved order templates such as "Weekly produce" and "Monthly dry goods": edit quantities, add/remove items, "Add list to cart", and a mock schedule toggle ("Remind me every Monday").

**`/cart` and `/checkout`**
- Cart: grouped lines, quantity steppers, per-line tier savings, stock warnings, save cart as list.
- Checkout, single page with sections: delivery location (select from company's locations), fulfilment method (delivery or pickup at a warehouse; if a line isn't available at the chosen warehouse, show a warning and suggest another), requested delivery date (calendar, Sundays disabled), PO number, notes, payment (Net 30 on account showing credit impact, or card on file).
- Summary: subtotal, tier savings, promotions, HST, total.
- **Team roles in action:** if the signed-in user is a Buyer and the total exceeds their $5,000 approval limit, the order is placed as `pending_approval` and the confirmation explains who will approve it.

**`/orders/confirmation/[id]`**
Success state with order number, summary, expected delivery, and actions: view order, download invoice (print-styled view), continue shopping.

**`/orders` and `/orders/[id]`**
Order history with filters (status, date, location, PO number). Detail: status `Timeline`, line items with any short-shipped quantities, delivery info, invoice link, "Reorder" (adds all to cart, flags unavailable items), "Report an issue" dialog.

**`/invoices`**
Statement view: open, overdue, paid; aging summary (current, 1–30, 31–60, 60+); invoice detail in a print-styled sheet; "Pay now" mock flow with success state.

**`/account`**
Tabs: Company profile, Delivery locations (add/edit), **Team members** (invite user, assign role Account admin / Buyer / Approver, set approval limit), Payment terms and credit, Notification preferences.

---

## 8. App 3 — Westwinds B2C app (`apps/mobile`)

### 8.1 Phone frame (critical)

On desktop the page shows **only the phone**, centred on a soft neutral background (`#E9EDEA` with a very subtle radial light). No headings, captions, logos or links outside the device.

Frame spec:
- Screen: **390 × 844** CSS px. Outer device: 12px bezel, border radius 56px (screen radius 44px), body colour `#1C1F1E` with a subtle 1px lighter inner ring and a soft drop shadow. Side buttons as small pseudo-elements. Generic device, no Apple branding or images.
- Dynamic-island style pill (126 × 36, top 11px) drawn in CSS.
- Status bar (height 54px) inside the screen: time `9:41` on the left, signal / wifi / battery icons on the right, colour adapts to the screen's header.
- Home indicator bar (134 × 5) at the bottom, above the app's bottom content.
- **Scale to fit:** if the viewport is shorter than ~900px, scale the whole device with `transform: scale()` so it always fits without page scrolling.
- **On real phones** (viewport width under 500px), render the app full-screen with no frame.

Implementation rules so the app behaves correctly inside the frame:
- The screen element is the scroll container (`overflow-y: auto`, hidden scrollbar, `overscroll-behavior: contain`), not the window.
- Give the screen element `transform: translateZ(0)` so any `position: fixed` descendant (sticky cart bar, tab bar, toaster) is positioned relative to the screen instead of the browser window.
- Create a `PhoneFrameProvider` that exposes the screen element via context. Every Radix portal (Dialog, Sheet, Popover, Select, DropdownMenu) and every vaul Drawer must render into that element via their `container` prop, so bottom sheets open inside the phone.
- Place the Sonner `<Toaster />` inside the screen, top-centre, below the status bar.
- Scroll the screen container to top on route change.
- Touch-first: 44px minimum hit areas, `active:` press states (scale 0.98) instead of hover effects, no hover-only interactions, bottom sheets instead of dialogs, swipe-to-dismiss on sheets.
- Page transitions: a short horizontal slide for push navigation and a fade for tab switches, using `motion`, respecting reduced motion.

### 8.2 App shell

- **Bottom tab bar:** Home, Categories, Orders, Account (lucide icons, active state with the primary colour and a small indicator).
- **Floating cart bar** above the tab bar whenever the cart has items: item count, total, "View cart". It animates in when the first item is added.
- Base font size 16px, generous spacing, 20px-radius cards.

### 8.3 Screens

**`/welcome`** (first launch only)
Three swipeable onboarding slides (fresh groceries, scheduled delivery, wholesale-backed prices) with pagination dots, then **`/login`**: phone number input with +1 prefix, "Send code", a 6-digit OTP input that accepts any code, then a delivery address picker (saved addresses list plus "Add new address" sheet).

**`/` Home**
- Header: delivery address selector (opens a sheet) and a notification bell.
- Greeting line in the display font and a search field (tapping opens `/search`).
- Banner carousel from the storefront data (auto-advance, swipeable).
- Category grid (2 rows, tinted tiles with icons).
- "Deals for you" horizontal rail with offer badges ("Save $1.20").
- "Buy again" rail from past orders.
- "Popular in your area" 2-column product grid.
- Next available delivery slot chip ("Tomorrow, 10 am to 12 pm").

**`/categories` and `/categories/[slug]`**
Category list with tinted tiles. Category page: sticky subcategory chips, sort and filter bottom sheet (price, brand, on offer), 2-column product grid with add buttons that turn into inline steppers.

**`/product/[sku]`**
Swipeable image area (category-tinted placeholder when no image), name in display font, unit size, price with compare-at price and savings badge, stock status, quantity stepper, sticky "Add to cart" bar with running price, expandable description, nutrition/details accordion, "Similar items" rail, favourite heart.

**`/search`**
Autofocus input, recent searches (clearable), popular searches chips, instant results as you type (debounced), empty state with suggestions.

**`/cart`**
Line items with steppers and swipe-to-delete, "You might also need" rail, promo code field (accepts `FRESH10` for 10% off, rejects others with a clear message), bill summary (item total, savings, delivery fee with free-delivery threshold progress bar, HST, total), "Proceed to checkout".

**`/checkout`**
Delivery address card, **delivery slot picker** (day tabs + time slot grid with some slots marked full), payment method sheet (saved card ending 4242, "Pay at door with debit", add card form), order notes, final summary, "Place order" button with a loading state.

**`/order-success/[id]`**
One orchestrated celebration moment (checkmark draw animation), order number, slot, and buttons "Track order" and "Continue shopping".

**`/orders`**
Tabs: Active and Past. Order cards with status badge, item thumbnails, total, date, and "Reorder" on past orders.

**`/orders/[id]`** (tracking)
- A status stepper: Placed, Confirmed, Packed, Out for delivery, Delivered, with timestamps. For the demo, an active order advances one step every ~6 s until "Out for delivery".
- An illustrated route card (inline SVG of simple streets with a moving van dot and destination pin; no map API).
- Driver card (name, vehicle, call and message buttons as mock actions), ETA, items list, bill details, "Need help?" sheet, and "Rate your order" after delivery.

**`/account`**
Profile header, and rows for: Addresses, Payment methods, Favourites, Notifications (toggles), Help & support (FAQ accordion), About, Log out. Each opens a real sub-screen or sheet.

---

## 9. Global behaviour and demo helpers

- **Loading:** every data view shows skeletons during the simulated delay; buttons show inline spinners during mutations.
- **Feedback:** every mutation ends with a toast that uses the same verb as the button ("Transfer requested", "Product saved", "Added to cart").
- **Empty states** for every list, each with one clear action.
- **Validation errors** say what's wrong and how to fix it.
- **Accessibility:** visible focus rings, labelled icon buttons, keyboard navigation for tables, menus and the command palette, `prefers-reduced-motion` respected.
- **Motion:** purposeful only (sheets, dialogs, cart bar, status changes, the order success moment). No scroll-triggered fade-ins on every section.
- **Login:** fake. Any credentials work. Store a demo session in zustand; protect routes client-side and redirect to `/login` when signed out.
- **`DemoSwitcher`** (Admin and B2B only): a small, collapsible pill in the bottom-left corner with links to the other two apps and "Reset demo data" (clears that app's persisted store and reloads). Hidden when the URL has `?present=1`.
- **Mobile app** gets no visible demo controls (the page must show only the phone). Support `?reset=1` to clear its persisted state.
- **Metadata:** proper page titles per route and a simple favicon per app.

---

## 10. Code quality rules

- TypeScript strict, no `any`. Shared types come from `@westwinds/data`.
- Server components for layouts and static shells; `"use client"` only where interactivity requires it.
- No file longer than ~300 lines; split into components.
- No API routes, no server actions that touch external services, no real network calls.
- No lorem ipsum anywhere; all copy is realistic and specific to Westwinds.
- Light theme only, but keep all colours as tokens so dark mode could be added later.
- Don't leave shadcn components at their default styling; they must use the tokens above.
- Don't use purple/blue gradient washes, glassmorphism, or emoji icons.
- Don't hotlink external images; use `ProductImage` placeholders and support optional local files at `public/products/{sku}.jpg`.

---

## 11. Build order

Work in phases. After each phase, run `pnpm typecheck && pnpm build`, fix all errors, give a short summary of what was built, and wait for my "continue" before starting the next phase.

1. **Scaffold:** Turborepo + pnpm, three Next.js apps on ports 3000/3001/3002, shared TypeScript and ESLint configs, `@westwinds/ui`, `@westwinds/data`, `@westwinds/lib` wired with `transpilePackages` and Tailwind `@source`. Prove it with a shared `Button` rendering in all three apps.
2. **Design system:** tokens, fonts, shadcn components restyled, and all shared composites from §4.4 (with a hidden `/_kit` page in admin to review them).
3. **Data layer:** types, seeded datasets, mock API, React Query provider, zustand stores.
4. **Admin app:** shell and role simulation first, then Dashboard, Inventory, Transfers, Orders, Products, then the remaining screens.
5. **B2B portal:** shell, Dashboard, Catalog with live stock, Product detail, Cart/Checkout with approval flow, Orders, Quick order, Lists, Invoices, Account.
6. **Mobile app:** phone frame and provider first (verify sheets and toasts stay inside the device), then shell, Home, Categories, Product, Search, Cart, Checkout, Success, Orders + tracking, Account, Welcome/Login.
7. **Polish pass:** consistency review across apps, loading/empty/error states everywhere, keyboard and focus review, 1024px check for Admin and B2B, frame scaling check for mobile on a 768px-tall laptop screen, final build.

---

## 12. Acceptance checklist

- [ ] `pnpm dev` starts all three apps; each also runs alone.
- [ ] `pnpm build` and `pnpm typecheck` pass with zero errors.
- [ ] Admin: switching "View as role" visibly changes navigation and disables restricted actions.
- [ ] Admin: creating a transfer, then receiving it, changes the numbers on `/inventory`.
- [ ] Admin: advancing an order's status updates the list, board and detail views.
- [ ] Admin: editing a product updates the live preview as you type; toggling channels changes its chips.
- [ ] Admin: QuickBooks "Sync now" animates and adds a new row to the sync log.
- [ ] B2B: stock availability visibly updates on the catalog without a page reload.
- [ ] B2B: quick order paste and CSV upload both validate lines correctly.
- [ ] B2B: a Buyer placing an order over $5,000 gets `pending_approval`.
- [ ] B2B: "Reorder" and "Add list to cart" both work.
- [ ] Mobile: on desktop only the phone is visible, it fits the viewport, and nothing renders outside it.
- [ ] Mobile: every sheet, dialog, popover and toast opens inside the phone screen.
- [ ] Mobile: full flow works: browse → add → cart → promo `FRESH10` → slot → pay → success → live tracking.
- [ ] Mobile: on a real phone it renders full-screen without the frame.
- [ ] All prices are CAD, HST is 13%, all numbers use tabular figures.
- [ ] Every list has skeleton, empty and populated states.

---

## 13. Suggested demo script (build data to support this)

1. **Admin** (as Owner): dashboard shows 7 low-stock SKUs. Open Honeycrisp apples: healthy in Brampton, low in Mississauga. Create a transfer Brampton → Mississauga using "Suggest items".
2. Open **Products**, create "Organic baby spinach 142 g", set B2B tiers, publish to both channels, and show the live preview.
3. Switch to **Warehouse staff** role to show the restricted navigation, then back to Owner.
4. **B2B portal** as Lakeshore Fresh Grocers: dashboard credit widget, "Buy again", live stock dots on the catalog, quick order via paste, checkout with a PO number, and the approval flow.
5. **Admin**: find order `WW-B-10482`, assign it to Mississauga, move it through picking and packing on the board, and show "Synced to QuickBooks".
6. **Mobile app**: browse deals, add items, apply `FRESH10`, choose a slot, place the order, and watch live tracking.
7. **Admin**: the app order appears in Orders with the App channel badge; finish on Reports and export a CSV.
