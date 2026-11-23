"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutGrid,
  ListOrdered,
  Package,
  Search,
  ShoppingCart,
  UserRound,
  Wallet,
  Warehouse,
  Zap,
} from "lucide-react";
import { brand, cn } from "@westwinds/lib";
import {
  Badge,
  Button,
  DemoSwitcher,
  Logo,
  Money,
} from "@westwinds/ui";
import { useCartStore } from "@/stores/cart-store";
import { AccountSwitcher } from "./account-switcher";
import { CreditStrip } from "./credit-strip";
import { ProductSearchDialog } from "./product-search-dialog";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/catalog", label: "Catalog", icon: LayoutGrid },
  { href: "/quick-order", label: "Quick order", icon: Zap },
  { href: "/lists", label: "Order lists", icon: ClipboardList },
  { href: "/orders", label: "Orders", icon: ListOrdered },
  { href: "/pickups", label: "Pickups", icon: Warehouse },
  { href: "/billing", label: "Billing", icon: Wallet },
  { href: "/account", label: "Account", icon: UserRound },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lines = useCartStore((s) => s.lines);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    const grew = itemCount > prevCount.current;
    prevCount.current = itemCount;
    if (!grew) return;
    setCartBump(true);
    const t = window.setTimeout(() => setCartBump(false), 600);
    return () => window.clearTimeout(t);
  }, [itemCount]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 lg:px-6">
          <Link href="/" className="shrink-0">
            <Logo size="sm" showWordmark wordmark={brand.b2bAppName} />
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active || undefined}
                  className={cn(
                    "b2b-nav-link inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]",
                  )}
                >
                  <item.icon className="size-3.5 opacity-70" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-3.5" />
              Search
            </Button>
            <AccountSwitcher />
            <Button
              asChild
              variant="soft"
              size="sm"
              className={cn("gap-2", cartBump && "b2b-bump")}
            >
              <Link href="/cart">
                <ShoppingCart className="size-3.5" />
                <span className="hidden tabular sm:inline">{itemCount}</span>
                <Money amount={Math.round(subtotal * 100) / 100} className="text-xs font-medium" />
              </Link>
            </Button>
          </div>
        </div>
        <CreditStrip />
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>

      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <Button asChild size="icon" className="size-12 rounded-full shadow-[var(--shadow-pop)]">
          <Link href="/cart" aria-label="Cart">
            <Package className="size-5" />
            {itemCount > 0 ? (
              <Badge className="absolute -right-1 -top-1 size-5 justify-center p-0 text-[10px]">
                {itemCount}
              </Badge>
            ) : null}
          </Link>
        </Button>
      </div>

      <ProductSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <DemoSwitcher
        adminUrl="http://localhost:3000"
        mobileUrl="http://localhost:3002"
        b2bUrl="http://localhost:3001"
      />
    </div>
  );
}
