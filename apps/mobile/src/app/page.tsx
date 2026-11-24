"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  ChevronDown,
  Cookie,
  CupSoda,
  LayoutGrid,
  Mic,
  Package,
  Percent,
  Search,
  ShoppingBag,
  SquareStack,
  UserRound,
  Utensils,
  WrapText,
  type LucideIcon,
} from "lucide-react";
import {
  getBanners,
  getCategories,
  getProducts,
  getPromotions,
  type Category,
  type Product,
} from "@calgarywholesale/data";
import { brand, cn } from "@calgarywholesale/lib";
import { CATEGORY_TINTS, ProductImage, Skeleton, SPOTLIGHT_TINTS } from "@calgarywholesale/ui";
import { AddressPickerSheet } from "@/components/address-sheet";
import { ProductGrid, ProductRail } from "@/components/product-card";
import { useStatusBarTone } from "@/components/phone-frame-context";
import { STATUS_BAR_H } from "@/lib/constants";
import { nextOpenSlot } from "@/lib/delivery-slots";
import { productImageSrc } from "@/lib/product-image";
import { useSessionStore } from "@/stores/session";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Large Bags": ShoppingBag,
  "Pastries, Desserts & Mixes": Cookie,
  "Single-Use Cutlery": Utensils,
  "Tableware & Dinnerware": SquareStack,
  "Beverage Packaging & Cups": CupSoda,
  "Food Prep Wraps & Films": WrapText,
  "Packaging & Operations": Package,
  "Commercial Napkins": Package,
  "Takeout & Catering Boxes": SquareStack,
  "Workwear & Protective Gear": Briefcase,
};

function shortName(name: string) {
  const parts = name.split(/[&,]/);
  return parts[0]!.trim();
}

function CategoryTile({
  category,
  product,
}: {
  category: Category;
  product?: Product;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex flex-col items-center gap-1.5 active:scale-[0.97]"
    >
      <div
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[var(--radius-md)]"
        style={{
          backgroundColor: CATEGORY_TINTS[category.name] ?? "#EEF3FF",
        }}
      >
        {product ? (
          <ProductImage
            src={productImageSrc(product.sku)}
            category={category.name}
            name={product.name}
            size="md"
            className="h-[72%] w-[72%] rounded-md bg-transparent shadow-none"
          />
        ) : (
          <span className="text-2xl font-bold text-[var(--primary)]">
            {category.name.charAt(0)}
          </span>
        )}
      </div>
      <span className="line-clamp-2 min-h-[2rem] text-center text-[11px] font-medium leading-tight text-[var(--foreground)]">
        {category.name}
      </span>
    </Link>
  );
}

function SpotlightCard({
  category,
  product,
  tint,
}: {
  category: Category;
  product?: Product;
  tint: string;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="relative flex h-[168px] w-[118px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-lg)] p-3 active:scale-[0.98]"
      style={{ backgroundColor: tint }}
    >
      <p className="relative z-10 text-[13px] font-bold leading-snug tracking-[-0.02em] text-[var(--foreground)]">
        {shortName(category.name)}
      </p>
      <div className="absolute inset-x-1 bottom-1 top-[42%] flex items-end justify-center">
        {product ? (
          <ProductImage
            src={productImageSrc(product.sku)}
            category={category.name}
            name={product.name}
            size="lg"
            className="h-full w-full rounded-md bg-transparent"
          />
        ) : null}
      </div>
    </Link>
  );
}

function FreqBoughtCard({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const preview = products.slice(0, 4);
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="w-[132px] shrink-0 rounded-[var(--radius-lg)] bg-[#EAF4FF] p-2.5 active:scale-[0.98]"
    >
      <div className="grid grid-cols-2 gap-1">
        {preview.map((p) => (
          <ProductImage
            key={p.id}
            src={productImageSrc(p.sku)}
            category={category.name}
            name={p.name}
            size="sm"
            className="aspect-square h-auto w-full rounded-md"
          />
        ))}
        {preview.length < 4
          ? Array.from({ length: 4 - preview.length }).map((_, i) => (
              <div
                key={`ph-${i}`}
                className="aspect-square rounded-md bg-white/60"
              />
            ))
          : null}
      </div>
      {products.length > 4 ? (
        <p className="mt-1.5 text-[10px] font-semibold text-[var(--accent)]">
          +{products.length - 4} more
        </p>
      ) : (
        <div className="mt-1.5 h-[14px]" />
      )}
      <p className="mt-1 line-clamp-2 text-[12px] font-bold leading-snug">
        {category.name}
      </p>
    </Link>
  );
}

export default function HomePage() {
  useStatusBarTone("light");
  const consumer = useSessionStore((s) => s.consumer);
  const address = useSessionStore((s) => s.address);
  const setAddress = useSessionStore((s) => s.setAddress);
  const [addrOpen, setAddrOpen] = React.useState(false);
  const [quick, setQuick] = React.useState("all");
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

  const categoryTabs = React.useMemo(
    () => [
      {
        id: "all",
        label: "All",
        href: "/categories",
        Icon: LayoutGrid,
        badge: null as string | null,
      },
      {
        id: "deals",
        label: "Deals",
        href: "/search?q=deal",
        Icon: Percent,
        badge: "New" as string | null,
      },
      ...categories.slice(0, 6).map((c) => ({
        id: c.id,
        label: shortName(c.name),
        href: `/categories/${c.slug}`,
        Icon: CATEGORY_ICONS[c.name] ?? Package,
        badge: null as string | null,
      })),
    ],
    [categories],
  );
  const productsByCat = React.useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const p of products) {
      (map[p.categoryId] ??= []).push(p);
    }
    return map;
  }, [products]);

  const sampleFor = (catId: string) => productsByCat[catId]?.[0];

  const deals = products.filter((p) => p.compareAtPrice).slice(0, 12);
  const buyAgain = products
    .filter((p) => consumer?.favouriteProductIds.includes(p.id))
    .slice(0, 10);
  const popular = products.slice(0, 9);
  const loading = productsQ.isLoading || catsQ.isLoading;

  const groceryCats = categories.slice(0, 8);
  const snackCats = categories.slice(4, 10);
  const spotlight = categories.slice(0, 6);
  const frequent = categories.slice(0, 5);

  const banner = bannersQ.data?.[0];
  const promo = promosQ.data?.[0];

  return (
    <div className="bg-[var(--background)] pb-4">
      {/* Blinkit-style coloured header — bleeds under status bar */}
      <header
        className="relative overflow-hidden bg-[var(--header)] pb-3 text-white"
        style={{ marginTop: -STATUS_BAR_H, paddingTop: STATUS_BAR_H + 4 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 85% 0%, rgba(255,255,255,0.25), transparent 55%)",
          }}
        />

        <div className="relative space-y-3 px-4 pt-1">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => setAddrOpen(true)}
              className="min-w-0 flex-1 text-left active:scale-[0.98]"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/75">
                Delivery in
              </p>
              <p className="font-display text-[28px] font-bold leading-none tracking-[-0.03em]">
                {slot.slot.replace("–", "–")}
              </p>
              <span className="mt-1.5 flex items-center gap-0.5 text-[13px] font-semibold">
                <span className="truncate">
                  {address?.label ?? "Choose address"}
                  {address ? ` · ${address.line1}` : ""}
                </span>
                <ChevronDown className="size-4 shrink-0 opacity-90" />
              </span>
              <p className="mt-0.5 text-[11px] text-white/70">
                {slot.day} · {brand.shortName}
              </p>
            </button>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/account"
                className="flex size-10 items-center justify-center rounded-full bg-black/25 active:scale-[0.96]"
                aria-label="Account"
              >
                <UserRound className="size-5" />
              </Link>
            </div>
          </div>

          <Link
            href="/search"
            className="flex h-11 items-center gap-2.5 rounded-full bg-white px-3.5 text-[var(--muted-foreground)] shadow-sm active:scale-[0.99]"
          >
            <Search className="size-[18px] text-[var(--foreground)]" />
            <span className="min-w-0 flex-1 truncate text-[14px]">
              Search bags, cups, boxes and more
            </span>
            <Mic className="size-[18px] text-[var(--subtle-foreground)]" />
          </Link>

          <div className="flex gap-1 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryTabs.map((item) => {
              const active = quick === item.id;
              const Icon = item.Icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setQuick(item.id)}
                  className="relative flex w-[64px] shrink-0 flex-col items-center gap-1 pb-2.5"
                >
                  <span className="relative flex size-9 items-center justify-center">
                    <Icon
                      className={cn(
                        "size-5",
                        active ? "text-white" : "text-white/80",
                      )}
                      strokeWidth={active ? 2.4 : 2}
                    />
                    {item.badge ? (
                      <span className="absolute -right-2 -top-1 rounded bg-[#E0352B] px-1 py-px text-[8px] font-bold leading-none text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "line-clamp-1 text-center text-[10px] font-semibold",
                      active ? "text-white" : "text-white/75",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "absolute bottom-0 h-[3px] w-10 rounded-full bg-white transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Thematic promo strip */}
      {(banner || promo) && (
        <section className="bg-[var(--header-deep)] px-4 pb-4 pt-1 text-white">
          <p className="font-display text-center text-[15px] font-semibold tracking-[0.04em]">
            {promo
              ? `${promo.code} · ${promo.description}`
              : banner?.headline}
          </p>
          <div className="mt-3 flex gap-2.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {spotlight.slice(0, 3).map((c, i) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="relative h-[140px] w-[110px] shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[#FFF8E8] p-2.5 text-[var(--foreground)] active:scale-[0.98]"
              >
                <p className="text-[12px] font-bold leading-snug">
                  {shortName(c.name)}
                </p>
                <div className="absolute inset-x-2 bottom-2 top-[40%]">
                  {sampleFor(c.id) ? (
                    <ProductImage
                      src={productImageSrc(sampleFor(c.id)!.sku)}
                      category={c.name}
                      name={sampleFor(c.id)!.name}
                      size="lg"
                      className="h-full w-full rounded-md bg-transparent"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center rounded-md text-xl font-bold"
                      style={{ backgroundColor: SPOTLIGHT_TINTS[i] }}
                    >
                      {c.name.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-6 pt-5">
        {/* Frequently bought */}
        {!loading && frequent.length > 0 ? (
          <section className="space-y-3">
            <h2 className="px-4 text-[17px] font-bold tracking-[-0.02em]">
              Frequently bought
            </h2>
            <div className="flex gap-2.5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {frequent.map((c) => (
                <FreqBoughtCard
                  key={c.id}
                  category={c}
                  products={productsByCat[c.id] ?? []}
                />
              ))}
            </div>
            <div className="px-4">
              <Link
                href="/categories"
                className="flex h-11 items-center justify-between rounded-[var(--radius-md)] bg-[#EAF4FF] px-3 active:scale-[0.99]"
              >
                <div className="flex -space-x-2">
                  {popular.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="overflow-hidden rounded-full border-2 border-[#EAF4FF] bg-white"
                    >
                      <ProductImage
                        src={productImageSrc(p.sku)}
                        category={catNameById[p.categoryId] ?? "Pantry"}
                        name={p.name}
                        size="sm"
                        className="size-8 rounded-full"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[13px] font-semibold text-[var(--foreground)]">
                  See all products →
                </span>
              </Link>
            </div>
          </section>
        ) : null}

        {/* Stores / lifestyle spotlight */}
        {!loading ? (
          <section className="space-y-3">
            <h2 className="px-4 text-[17px] font-bold tracking-[-0.02em]">
              Stores in spotlight
            </h2>
            <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {spotlight.map((c, i) => (
                <SpotlightCard
                  key={c.id}
                  category={c}
                  product={sampleFor(c.id)}
                  tint={SPOTLIGHT_TINTS[i % SPOTLIGHT_TINTS.length]!}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Category grids */}
        <section className="space-y-3 px-4">
          <h2 className="text-[17px] font-bold tracking-[-0.02em]">
            Kitchen & packaging
          </h2>
          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-[var(--radius-md)]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {groceryCats.map((c) => (
                <CategoryTile
                  key={c.id}
                  category={c}
                  product={sampleFor(c.id)}
                />
              ))}
            </div>
          )}
        </section>

        {!loading && snackCats.length > 0 ? (
          <section className="space-y-3 px-4">
            <h2 className="text-[17px] font-bold tracking-[-0.02em]">
              Service & ops
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {snackCats.map((c) => (
                <CategoryTile
                  key={c.id}
                  category={c}
                  product={sampleFor(c.id)}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Picks for your lifestyle */}
        {!loading ? (
          <section className="space-y-3">
            <h2 className="px-4 text-[17px] font-bold tracking-[-0.02em]">
              Picks for your kitchen
            </h2>
            <div className="grid grid-cols-4 gap-2.5 px-4">
              {categories.slice(0, 4).map((c, i) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-[var(--radius-lg)] p-2 active:scale-[0.97]"
                  style={{
                    backgroundColor:
                      SPOTLIGHT_TINTS[(i + 2) % SPOTLIGHT_TINTS.length],
                  }}
                >
                  <p className="relative z-10 text-[11px] font-bold leading-snug">
                    {shortName(c.name)}
                  </p>
                  <div className="absolute inset-x-1 bottom-1 top-[36%]">
                    {sampleFor(c.id) ? (
                      <ProductImage
                        src={productImageSrc(sampleFor(c.id)!.sku)}
                        category={c.name}
                        name={sampleFor(c.id)!.name}
                        size="md"
                        className="h-full w-full rounded-md bg-transparent"
                      />
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {loading ? (
          <div className="space-y-3 px-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-3 overflow-hidden">
              <Skeleton className="h-48 w-28 shrink-0 rounded-[var(--radius-md)]" />
              <Skeleton className="h-48 w-28 shrink-0 rounded-[var(--radius-md)]" />
              <Skeleton className="h-48 w-28 shrink-0 rounded-[var(--radius-md)]" />
            </div>
          </div>
        ) : (
          <>
            {deals.length > 0 ? (
              <ProductRail
                title="Deals for you"
                subtitle="Because you shop packaging staples"
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
              <h2 className="text-[17px] font-bold tracking-[-0.02em]">
                Popular near you
              </h2>
              <ProductGrid
                products={popular}
                categoryById={catNameById}
                columns={3}
              />
            </section>
          </>
        )}
      </div>

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
