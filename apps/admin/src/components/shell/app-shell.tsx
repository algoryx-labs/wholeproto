"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { DemoSwitcher } from "@westwinds/ui";
import { adminUrl, b2bUrl, mobileUrl } from "@/lib/env";
import { useInventoryStore } from "@/stores/inventory-store";
import { AuthGuard } from "@/components/auth-guard";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const present = searchParams.get("present") === "1";
  const resetDemo = useInventoryStore((s) => s.resetDemo);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const apply = () => setCollapsed(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
        </div>
        <DemoSwitcher
          adminUrl={adminUrl}
          b2bUrl={b2bUrl}
          mobileUrl={mobileUrl}
          hide={present}
          onReset={resetDemo}
        />
      </div>
    </AuthGuard>
  );
}
