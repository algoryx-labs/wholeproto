"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";
import { Skeleton } from "@westwinds/ui";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const signedIn = useSessionStore((s) => s.signedIn);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    if (!signedIn) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [ready, signedIn, router, pathname]);

  if (!ready || !signedIn) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-6 py-16">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
