"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Package,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatCurrency, cn } from "@westwinds/lib";
import { calcCartTotals } from "@/lib/cart-math";
import { TAB_BAR_H } from "@/lib/constants";
import { useCartStore } from "@/stores/cart";
import { useSessionStore } from "@/stores/session";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/account", label: "Account", icon: UserRound },
] as const;

const TAB_ROUTES = new Set(["/", "/categories", "/orders", "/account"]);
const PUBLIC = new Set(["/welcome", "/login"]);

function showTabs(pathname: string) {
  if (TAB_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/categories/")) return true;
  return false;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const signedIn = useSessionStore((s) => s.signedIn);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!signedIn && !PUBLIC.has(pathname)) {
      router.replace("/welcome");
      return;
    }
    if (signedIn && PUBLIC.has(pathname)) {
      router.replace("/");
    }
  }, [signedIn, pathname, router]);

  if (!signedIn && !PUBLIC.has(pathname)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[var(--muted-foreground)]">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}

function FloatingCartBar() {
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const totals = calcCartTotals(lines, promoCode);
  const pathname = usePathname();
  const hide =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/order-success") ||
    pathname === "/welcome" ||
    pathname === "/login";

  return (
    <AnimatePresence>
      {count > 0 && !hide ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-3 z-30"
          style={{ bottom: TAB_BAR_H + 18 }}
        >
          <Link
            href="/cart"
            className="flex h-14 items-center justify-between rounded-[var(--radius-lg)] bg-[var(--primary)] px-4 text-[var(--primary-foreground)] shadow-[var(--shadow-pop)] active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 tabular">
                {count}
              </span>
              View cart
            </span>
            <span className="font-semibold tabular">
              {formatCurrency(totals.total)}
            </span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function BottomTabs() {
  const pathname = usePathname();
  if (!showTabs(pathname)) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md"
      style={{ height: TAB_BAR_H, paddingBottom: 10 }}
    >
      <ul className="grid h-full grid-cols-4">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium active:scale-[0.98]",
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)]",
                )}
              >
                <Icon
                  className="size-5"
                  strokeWidth={active ? 2.4 : 2}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabs = showTabs(pathname);
  const lines = useCartStore((s) => s.lines);
  const hasCart = lines.length > 0;
  const bottomPad = tabs
    ? TAB_BAR_H + (hasCart && pathname !== "/cart" ? 72 : 12)
    : 12;

  return (
    <AuthGate>
      <div style={{ paddingBottom: bottomPad }}>{children}</div>
      <FloatingCartBar />
      <BottomTabs />
    </AuthGate>
  );
}