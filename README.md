# Westwinds Wholesale — Frontend Prototype

Clickable, frontend-only demo of three connected products for a multi-warehouse grocery wholesaler (Ontario, CAD, HST 13%).

| App | Folder | Port | Command |
|---|---|---|---|
| **Admin** (Cin7-style inventory + orders + listings) | `apps/admin` | 3000 | `pnpm dev:admin` |
| **Westwinds Trade** (B2B portal) | `apps/b2b` | 3001 | `pnpm dev:b2b` |
| **Westwinds** (B2C mobile) | `apps/mobile` | 3002 | `pnpm dev:mobile` |

```bash
pnpm install
pnpm dev          # all three
pnpm typecheck
pnpm build
```

Detailed client brief: [`PROTOTYPE-BRIEF.md`](./PROTOTYPE-BRIEF.md)  
Full engineering prompt: [`westwinds-prototype-cursor-prompt.md`](./westwinds-prototype-cursor-prompt.md)

## Demo credentials

| App | How to sign in |
|---|---|
| Admin | Any email/password; use role chips or “View as role” |
| B2B | `buyer@lakeshorefresh.ca` + any password (Lakeshore Fresh Grocers) |
| Mobile | Phone + any 6-digit OTP → pick address |

## Client demo path

1. **Admin** → Dashboard (Honeycrisp low at Mississauga) → Stock levels → Transfer Brampton → Mississauga → Receive → matrix updates  
2. **Admin** → Products / Storefront (feeds mobile banners) → Orders → **WW-B-10482**  
3. **Trade** → Catalog (live stock dots) → Cart / Checkout (Buyer over $5k → pending approval) → Orders  
4. **Mobile** → Browse → Cart → promo **`FRESH10`** → Checkout → Track order (auto-advances)  
5. Jump between apps with the **Demo** pill (Admin & B2B). Mobile: `?reset=1` clears state. Hide demo chrome with `?present=1` on Admin/B2B.

## Shared packages

- `@westwinds/ui` — design tokens + components (signature: `StockHealth`)
- `@westwinds/data` — types, seeded Ontario grocery data, mock API delays
- `@westwinds/lib` — brand constants, `formatCurrency`, `cn`

Key seed IDs: Lakeshore `b2b-lakeshore`, Honeycrisp `WW-PRD-10231`, order `WW-B-10482`.

## Note (this machine)

Windows Application Control may block `turbo.exe` and Next native SWC. Root scripts use `pnpm --filter`; Next falls back to WASM SWC.
