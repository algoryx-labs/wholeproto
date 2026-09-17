"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";
import { Skeleton } from "@westwinds/ui";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const signedIn = useSessionStore((s) => s.signedIn);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!signedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [hydrated, signedIn, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 p-8">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!signedIn && pathname !== "/login") {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 p-8">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return <>{children}</>;
}
