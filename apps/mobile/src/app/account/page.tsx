"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
} from "lucide-react";
import { getProducts } from "@westwinds/data";
import { brand, formatCurrency } from "@westwinds/lib";
import { Button, ProductImage } from "@westwinds/ui";
import { productImageSrc } from "@/lib/product-image";
import { AddressPickerSheet } from "@/components/address-sheet";
import { MobileSheet } from "@/components/mobile-sheet";
import { useCartStore } from "@/stores/cart";
import { useSessionStore } from "@/stores/session";

const FAQ = [
  {
    q: "When will my order arrive?",
    a: "Pick a delivery slot at checkout. Active orders show live status on the Orders tab.",
  },
  {
    q: "What is FRESH10?",
    a: "A demo promo for 10% off your mobile grocery subtotal. Other codes are rejected in this prototype.",
  },
  {
    q: "Can I pay at the door?",
    a: "Yes — choose Pay at door, or pay now on the mock gateway with card 4242 / Apple Pay / Google Pay.",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const consumer = useSessionStore((s) => s.consumer);
  const address = useSessionStore((s) => s.address);
  const setAddress = useSessionStore((s) => s.setAddress);
  const logout = useSessionStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clear);

  const [addrOpen, setAddrOpen] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [favOpen, setFavOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [notifOn, setNotifOn] = React.useState(true);

  const favQ = useQuery({
    queryKey: ["favourites", consumer?.favouriteProductIds],
    queryFn: async () => {
      const all = await getProducts({ channel: "mobile", status: "active" });
      const ids = new Set(consumer?.favouriteProductIds ?? []);
      return all.filter((p) => ids.has(p.id));
    },
    enabled: favOpen,
  });

  const onLogout = () => {
    clearCart();
    logout();
    router.replace("/welcome");
  };

  return (
    <div className="space-y-5 px-4 pb-6 pt-2">
      <h1 className="text-[22px] font-bold tracking-[-0.03em]">Account</h1>

      <div className="rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <p className="font-display text-xl font-semibold">
          {consumer?.name ?? "Guest"}
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {consumer?.phone}
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">{consumer?.email}</p>
      </div>

      <ul className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <Row
          icon={<MapPin className="size-5" />}
          label="Addresses"
          value={address?.label}
          onClick={() => setAddrOpen(true)}
        />
        <Row
          icon={<CreditCard className="size-5" />}
          label="Payment"
          value="Visa ···· 4242"
          onClick={() => setPayOpen(true)}
        />
        <Row
          icon={<Heart className="size-5" />}
          label="Favourites"
          onClick={() => setFavOpen(true)}
        />
        <Row
          icon={<Bell className="size-5" />}
          label="Notifications"
          value={notifOn ? "On" : "Off"}
          onClick={() => setNotifOn((v) => !v)}
        />
        <Row
          icon={<HelpCircle className="size-5" />}
          label="Help & FAQ"
          onClick={() => setHelpOpen(true)}
        />
        <Row
          icon={<Info className="size-5" />}
          label="About"
          onClick={() => setAboutOpen(true)}
          last
        />
      </ul>

      <Button
        variant="outline"
        className="h-12 w-full text-[var(--danger)] active:scale-[0.98]"
        onClick={onLogout}
      >
        <LogOut className="size-4" />
        Log out
      </Button>

      <AddressPickerSheet
        open={addrOpen}
        onOpenChange={setAddrOpen}
        addresses={consumer?.addresses ?? []}
        selectedId={address?.id}
        onSelect={setAddress}
      />

      <MobileSheet
        open={payOpen}
        onOpenChange={setPayOpen}
        title="Payment methods"
        description="Demo cards only"
      >
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
          <p className="font-medium">Visa ending 4242</p>
          <p className="text-sm text-[var(--muted-foreground)]">Expires 12/28</p>
        </div>
      </MobileSheet>

      <MobileSheet
        open={favOpen}
        onOpenChange={setFavOpen}
        title="Favourites"
      >
        <ul className="space-y-2">
          {(favQ.data ?? []).map((p) => (
            <li key={p.id}>
              <Link
                href={`/product/${p.sku}`}
                className="flex items-center gap-3 rounded-[var(--radius-md)] p-2 active:scale-[0.98]"
                onClick={() => setFavOpen(false)}
              >
                <ProductImage
                  src={productImageSrc(p.sku)}
                  category="Pantry"
                  name={p.name}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)] tabular">
                    {formatCurrency(p.b2cPrice)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          {favQ.isFetched && (favQ.data?.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
              No favourites yet
            </p>
          ) : null}
        </ul>
      </MobileSheet>

      <MobileSheet open={helpOpen} onOpenChange={setHelpOpen} title="Help & FAQ">
        <ul className="space-y-3">
          {FAQ.map((item) => (
            <li
              key={item.q}
              className="rounded-[var(--radius-md)] bg-[var(--surface-sunken)] p-4"
            >
              <p className="font-medium">{item.q}</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {item.a}
              </p>
            </li>
          ))}
        </ul>
      </MobileSheet>

      <MobileSheet open={aboutOpen} onOpenChange={setAboutOpen} title="About">
        <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
          <p className="font-display text-lg font-semibold text-[var(--foreground)]">
            {brand.mobileAppName}
          </p>
          <p>
            Consumer grocery delivery powered by {brand.companyName} warehouses
            across the GTA.
          </p>
          <p>Prototype build · frontend only</p>
          <p>
            Support · {brand.supportEmail} · {brand.supportPhone}
          </p>
        </div>
      </MobileSheet>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  onClick,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex h-14 w-full items-center gap-3 px-4 text-left active:scale-[0.98] ${
          last ? "" : "border-b border-[var(--border)]"
        }`}
      >
        <span className="text-[var(--primary)]">{icon}</span>
        <span className="flex-1 font-medium">{label}</span>
        {value ? (
          <span className="text-sm text-[var(--muted-foreground)]">{value}</span>
        ) : null}
        <ChevronRight className="size-4 text-[var(--subtle-foreground)]" />
      </button>
    </li>
  );
}