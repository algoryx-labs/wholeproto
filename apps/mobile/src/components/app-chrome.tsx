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
import { ScreenDock } from "./screen-dock";

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

function FloatingCartBar({ visible }: { visible: boolean }) {
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const totals = calcCartTotals(lines, promoCode);

  return (
    <AnimatePresence>
      {visible && count > 0 ? (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 10 }}
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
      className="border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md"
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
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Sticky chrome — portaled into the phone frame chrome layer (never scrolls). */
function MobileChrome() {
  const pathname = usePathname();
  const tabs = showTabs(pathname);
  const hideCart =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/order-success") ||
    pathname === "/welcome" ||
    pathname === "/login";

  if (!tabs && hideCart) return null;

  return (
    <ScreenDock>
      {!hideCart ? <FloatingCartBar visible /> : null}
      {tabs ? <BottomTabs /> : null}
    </ScreenDock>
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabs = showTabs(pathname);
  const lines = useCartStore((s) => s.lines);
  const hasCart = lines.length > 0;
  const hideCart =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/order-success");
  const bottomPad = tabs
    ? TAB_BAR_H + (hasCart && !hideCart ? 72 : 16)
    : hideCart
      ? 88
      : 16;

  return (
    <AuthGate>
      <div style={{ paddingBottom: bottomPad }}>{children}</div>
      <MobileChrome />
    </AuthGate>
  );
}
