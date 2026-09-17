"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CART_KEY, SESSION_KEY } from "@/lib/constants";
import { useCartStore } from "@/stores/cart";
import { useSessionStore } from "@/stores/session";
import { PhoneFrame } from "./phone-frame";

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function ResetHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (params.get("reset") !== "1") return;
    useSessionStore.getState().reset();
    useCartStore.getState().reset();
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(CART_KEY);
    } catch {
      /* ignore */
    }
    router.replace(pathname);
  }, [params, pathname, router]);

  return null;
}

function ScrollToTop() {
  const pathname = usePathname();
  React.useEffect(() => {
    const screen =
      document.querySelector(".phone-scroll") ??
      document.querySelector(".phone-screen");
    if (screen) screen.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(makeClient);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const finish = () => setReady(true);
    const unsubSession = useSessionStore.persist.onFinishHydration(finish);
    const unsubCart = useCartStore.persist.onFinishHydration(finish);
    void useSessionStore.persist.rehydrate();
    void useCartStore.persist.rehydrate();
    if (
      useSessionStore.persist.hasHydrated() &&
      useCartStore.persist.hasHydrated()
    ) {
      finish();
    }
    return () => {
      unsubSession();
      unsubCart();
    };
  }, []);

  return (
    <QueryClientProvider client={client}>
      <PhoneFrame>
        <React.Suspense fallback={null}>
          <ResetHandler />
        </React.Suspense>
        <ScrollToTop />
        {ready ? (
          children
        ) : (
          <div className="flex min-h-[70vh] items-center justify-center text-sm text-[var(--muted-foreground)]">
            Loading…
          </div>
        )}
      </PhoneFrame>
    </QueryClientProvider>
  );
}