"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  UserRound,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@westwinds/ui";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getWarehouses } from "@westwinds/data";
import { searchablePages } from "@/lib/nav";
import { VIEW_AS_ROLES } from "@/lib/roles";
import { useSessionStore } from "@/stores/session-store";

export function TopBar() {
  const router = useRouter();
  const email = useSessionStore((s) => s.email);
  const roleId = useSessionStore((s) => s.roleId);
  const setRoleId = useSessionStore((s) => s.setRoleId);
  const warehouseScopeId = useSessionStore((s) => s.warehouseScopeId);
  const setWarehouseScopeId = useSessionStore((s) => s.setWarehouseScopeId);
  const signOut = useSessionStore((s) => s.signOut);

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products-search"],
    queryFn: () => getProducts(),
    enabled: searchOpen,
  });

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const pageHits = searchablePages.filter(
    (p) =>
      !q ||
      p.label.toLowerCase().includes(q) ||
      p.group.toLowerCase().includes(q),
  );
  const productHits = products
    .filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    )
    .slice(0, 8);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur">
      <Button
        type="button"
        variant="outline"
        className="h-9 min-w-0 flex-1 justify-start gap-2 text-[var(--muted-foreground)] sm:max-w-sm"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate text-sm">Search pages & products…</span>
        <kbd className="ml-auto hidden rounded border border-[var(--border)] bg-[var(--surface-sunken)] px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>

      <Select
        value={warehouseScopeId}
        onValueChange={setWarehouseScopeId}
      >
        <SelectTrigger className="h-9 w-[160px] sm:w-[200px]">
          <SelectValue placeholder="Warehouse" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All warehouses</SelectItem>
          {warehouses.map((w) => (
            <SelectItem key={w.id} value={w.id}>
              {w.code} — {w.name.split(" ")[0]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--warning)]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="border-b border-[var(--border)] px-3 py-2">
            <p className="text-sm font-medium">Notifications</p>
          </div>
          <ul className="divide-y divide-[var(--border)] text-sm">
            <li className="px-3 py-2.5">
              <p className="font-medium">Honeycrisp low at MDC</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Reorder or transfer from Brampton
              </p>
            </li>
            <li className="px-3 py-2.5">
              <p className="font-medium">WW-B-10482 confirmed</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Lakeshore Fresh — awaiting pick
              </p>
            </li>
            <li className="px-3 py-2.5">
              <p className="font-medium">QuickBooks sync healthy</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Last run completed without errors
              </p>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" className="gap-2 px-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary)]">
              <UserRound className="size-3.5" />
            </span>
            <span className="hidden max-w-[140px] truncate text-sm md:inline">
              {email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{email}</p>
            <p className="text-xs text-[var(--muted-foreground)]">View as role</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={roleId} onValueChange={setRoleId}>
            {VIEW_AS_ROLES.map((r) => (
              <DropdownMenuRadioItem key={r.id} value={r.id}>
                {r.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signOut();
              router.push("/login");
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-[var(--border)] px-4 py-3">
            <DialogTitle className="sr-only">Search</DialogTitle>
            <Input
              autoFocus
              placeholder="Search pages and products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto p-2">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Pages
            </p>
            {pageHits.slice(0, 8).map((p) => (
              <button
                key={p.href}
                type="button"
                className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm hover:bg-[var(--primary-soft)]"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                  router.push(p.href);
                }}
              >
                <span>{p.label}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {p.group}
                </span>
              </button>
            ))}
            {productHits.length > 0 ? (
              <>
                <p className="mt-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Products
                </p>
                {productHits.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="flex w-full flex-col rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm hover:bg-[var(--primary-soft)]"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                      router.push(`/products/${p.id}`);
                    }}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs tabular text-[var(--muted-foreground)]">
                      {p.sku}
                    </span>
                  </button>
                ))}
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
