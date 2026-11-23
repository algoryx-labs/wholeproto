"use client";

import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@westwinds/data";
import {
  Badge,
  PageHeader,
  SectionCard,
  Skeleton,
} from "@westwinds/ui";

export default function StorefrontPage() {
  const bannersQ = useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanners(false),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="App storefront"
        description="Banners and featured surfaces that drive the Wholesale Calgary mobile home."
      />

      <SectionCard
        title="Home banners"
        description="These slots appear on the mobile home carousel. Changes here are meant to mirror the consumer app."
      >
        {bannersQ.isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <ul className="space-y-3">
            {(bannersQ.data ?? []).map((b) => (
              <li
                key={b.id}
                className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]"
              >
                <div
                  className="px-4 py-5"
                  style={{ background: b.tintColour }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-semibold">
                        {b.headline}
                      </p>
                      <p className="mt-1 max-w-xl text-sm opacity-80">
                        {b.subcopy}
                      </p>
                      <p className="mt-3 text-sm font-medium">{b.ctaLabel}</p>
                    </div>
                    <Badge variant={b.active ? "success" : "secondary"}>
                      {b.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs opacity-70">
                    Art direction: {b.imageHint}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
