"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Clock3, Search } from "lucide-react";
import {
  getBanners,
  getCategories,
  getProducts,
  getPromotions,
} from "@westwinds/data";
import { Skeleton } from "@westwinds/ui";
import { CATEGORY_TINTS } from "@westwinds/ui";
import { BannerCarousel } from "@/components/banner-carousel";
import { AddressPickerSheet } from "@/components/address-sheet";
import { ProductGrid, ProductRail } from "@/components/product-card";
import { nextOpenSlot } from "@/lib/delivery-slots";
import { useSessionStore } from "@/stores/session";

export default function HomePage() {
  const consumer = useSessionStore((s) => s.consumer);
  const address = useSessionStore((s) => s.address);
  const setAddress = useSessionStore((s) => s.setAddress);
  const [addrOpen, setAddrOpen] = React.useState(false);
  const slot = React.useMemo(() => nextOpenSlot(), []);

  const productsQ = useQuery({
    queryKey: ["products", "mobile"],
    queryFn: () => getProducts({ channel: "mobile", status: "active" }),
  });
  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const bannersQ = useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanners(true),
  });
  const promosQ = useQuery({
    queryKey: ["promotions", "b2c"],
    queryFn: () => getPromotions({ activeOnly: true, channel: "b2c" }),
  });

  const products = productsQ.data ?? [];
  const categories = catsQ.data ?? [];
  const catNameById = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const firstName = consumer?.name.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const deals = products.filter((p) => p.compareAtPrice).slice(0, 10);
  const buyAgain = products
    .filter((p) => consumer?.favouriteProductIds.includes(p.id))
    .slice(0, 8);
  const popular = products.slice(0, 8);
  const loading = productsQ.isLoading || catsQ.isLoading;

  return (
    <div className="space-y-7 pb-4">
      <header className="space-y-3 px-4 pt-2">
        <button
          type="button"
          onClick={() => setAddrOpen(true)}
          className="flex items-center gap-1 text-left active:scale-[0.98]"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Deliver to
          </span>
          <span className="flex items-center gap-0.5 text-sm font-semibold">
            {address?.label ?? "Choose address"}
            <ChevronDown className="size-4" />
          </span>
        </button>
        {address ? (
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {address.line1}, {address.city}
          </p>
        ) : null}

        <h1 className="font-display text-[1.85rem] font-semibold tracking-[-0.03em]">
          {greeting}, {firstName}
        </h1>

        <Link
          href="/search"
          className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface)] px-4 text-[var(--muted-foreground)] shadow-[var(--shadow-card)] active:scale-[0.98]"
        >
          <Search className="size-5" />
          <span className="text-[15px]">Search groceries</span>
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-medium text-[var(--primary)]">
          <Clock3 className="size-3.5" />
          Next slot · {slot.day} {slot.slot}
        </div>
      </header>

      {bannersQ.isLoading ? (
        <div className="px-4">
          <Skeleton className="h-36 w-full rounded-[var(--radius-lg)]" />
        </div>
      ) : (
        <BannerCarousel banners={bannersQ.data ?? []} />
      )}

      <section className="space-y-3">
        <h2 className="px-4 font-display text-lg font-semibold tracking-[-0.02em]">
          Categories
        </h2>
        <div className="grid grid-cols-4 gap-3 px-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-[var(--radius-md)]" />
              ))
            : categories.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="flex flex-col items-center gap-1.5 active:scale-[0.98]"
                >
                  <div
                    className="flex aspect-square w-full items-center justify-center rounded-[var(--radius-md)] text-lg font-semibold"
                    style={{
                      backgroundColor: CATEGORY_TINTS[c.name] ?? "#EEF2EF",
                    }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight">
                    {c.name}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      {promosQ.data?.[0] ? (
        <div className="mx-4 rounded-[var(--radius-lg)] bg-[var(--offer-soft)] px-4 py-3 text-sm text-[var(--warning)]">
          <span className="font-semibold">{promosQ.data[0].code}</span>
          {" — "}
          {promosQ.data[0].description}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3 px-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-3 overflow-hidden">
            <Skeleton className="h-48 w-36 shrink-0 rounded-[var(--radius-lg)]" />
            <Skeleton className="h-48 w-36 shrink-0 rounded-[var(--radius-lg)]" />
          </div>
        </div>
      ) : (
        <>
          {deals.length > 0 ? (
            <ProductRail
              title="Deals"
              products={deals}
              categoryById={catNameById}
            />
          ) : null}
          {buyAgain.length > 0 ? (
            <ProductRail
              title="Buy again"
              products={buyAgain}
              categoryById={catNameById}
            />
          ) : null}
          <section className="space-y-3 px-4">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
              Popular near you
            </h2>
            <ProductGrid products={popular} categoryById={catNameById} />
          </section>
        </>
      )}

      <AddressPickerSheet
        open={addrOpen}
        onOpenChange={setAddrOpen}
        addresses={consumer?.addresses ?? []}
        selectedId={address?.id}
        onSelect={setAddress}
      />
    </div>
  );
}