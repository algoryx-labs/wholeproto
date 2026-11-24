"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Search, X } from "lucide-react";
import { getCategories, getProducts } from "@calgarywholesale/data";
import { Input, Skeleton } from "@calgarywholesale/ui";
import { ProductGrid } from "@/components/product-card";

const POPULAR = ["Cups", "Bags", "Napkins", "Cutlery", "Clamshell", "Gloves"];
const RECENT_KEY = "cw-mobile:recent-searches";

function useDebounced(value: string, ms = 280) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function SearchPage() {
  const [q, setQ] = React.useState("");
  const debounced = useDebounced(q);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [recent, setRecent] = React.useState<string[]>([]);

  React.useEffect(() => {
    inputRef.current?.focus();
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const resultsQ = useQuery({
    queryKey: ["search", debounced],
    queryFn: () =>
      getProducts({ channel: "mobile", status: "active", search: debounced }),
    enabled: debounced.trim().length >= 2,
  });

  const catNameById = Object.fromEntries(
    (catsQ.data ?? []).map((c) => [c.id, c.name]),
  );

  const commitSearch = (term: string) => {
    setQ(term);
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-4 bg-white px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground)]" />
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) commitSearch(q.trim());
            }}
            placeholder="Search for bags, cups, boxes and more"
            className="h-11 rounded-full border-[var(--border)] pl-10 pr-10 text-[14px] shadow-none"
          />
          {q ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center"
              onClick={() => setQ("")}
              aria-label="Clear"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {debounced.trim().length < 2 ? (
        <div className="space-y-5">
          {recent.length > 0 ? (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
                Recent
              </h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => commitSearch(r)}
                    className="h-9 rounded-full border border-[var(--border)] bg-white px-4 text-sm active:scale-[0.98]"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
              Popular
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => commitSearch(r)}
                  className="h-9 rounded-full bg-[var(--primary-soft)] px-4 text-sm font-medium text-[var(--primary)] active:scale-[0.98]"
                >
                  {r}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : resultsQ.isLoading ? (
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-[var(--radius-md)]" />
          ))}
        </div>
      ) : (resultsQ.data ?? []).length === 0 ? (
        <p className="py-12 text-center text-[var(--muted-foreground)]">
          No matches for “{debounced}”
        </p>
      ) : (
        <ProductGrid
          products={resultsQ.data ?? []}
          categoryById={catNameById}
          columns={3}
        />
      )}
    </div>
  );
}