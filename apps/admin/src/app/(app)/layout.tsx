import { Suspense } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Skeleton } from "@calgarywholesale/ui";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Skeleton className="h-8 w-48" />
        </div>
      }
    >
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
