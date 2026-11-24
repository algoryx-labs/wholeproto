"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  Home,
  LayoutGrid,
  Package,
  RotateCcw,
  Search,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@calgarywholesale/lib";
import { ProductImage } from "@calgarywholesale/ui";
import { TAB_BAR_H } from "@/lib/constants";
import { useCartStore } from "@/stores/cart";
import { useSessionStore } from "@/stores/session";
import { ScreenDock } from "./screen-dock";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/orders", label: "Order again", icon: RotateCcw },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/search", label: "Search", icon: Search },
  { href: "/account", label: "Account", icon: UserRound },
] as const;

const TAB_ROUTES = new Set(["/", "/categories", "/orders", "/account", "/search"]);
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
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const preview = lines.slice(0, 2);

  return (
    <AnimatePresence>
      {visible && count > 0 ? (
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 28, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="flex justify-center px-4 pb-2"
        >
          <Link
            href="/cart"
            className="flex h-[52px] w-full max-w-[340px] items-center gap-3 rounded-full bg-[var(--primary)] pl-1.5 pr-2 text-[var(--primary-foreground)] shadow-[var(--shadow-pop)] active:scale-[0.98]"
          >
            <div className="flex -space-x-2">
              {preview.map((line) => (
                <div
                  key={line.productId}
                  className="overflow-hidden rounded-full border-2 border-[var(--primary)] bg-white"
                >
                  <ProductImage
                    src={line.imageSrc}
                    category={line.categoryName ?? "Pantry"}
                    name={line.name}
                    size="sm"
                    className="size-10 rounded-full"
                  />
                </div>
              ))}
              {preview.length === 0 ? (
                <span className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Package className="size-4" />
                </span>
              ) : null}
            </div>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[13px] font-bold">View cart</span>
              <span className="block text-[11px] text-white/85">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-black/15">
              <ChevronRight className="size-5" strokeWidth={2.5} />
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
      className="border-t border-[var(--border)] bg-white"
      style={{ height: TAB_BAR_H, paddingBottom: 8 }}
    >
      <ul className="grid h-full grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          const isCategories = href === "/categories";
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[9px] font-medium active:scale-[0.98]",
                  active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)]",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-xl transition-colors",
                    active && "bg-[var(--nav-active)]",
                    isCategories && !active && "bg-[var(--surface-sunken)]",
                  )}
                >
                  <Icon
                    className="size-[18px]"
                    strokeWidth={active || isCategories ? 2.4 : 2}
                    fill={active && href === "/" ? "currentColor" : "none"}
                  />
                </span>
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
    pathname === "/payment" ||
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
    pathname === "/payment" ||
    pathname.startsWith("/order-success");
  const bottomPad = tabs
    ? TAB_BAR_H + (hasCart && !hideCart ? 68 : 12)
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
