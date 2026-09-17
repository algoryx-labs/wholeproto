"use client";

import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "@westwinds/data";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  Skeleton,
} from "@westwinds/ui";

export default function WarehousesPage() {
  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Mississauga, Brampton, Etobicoke, and Hamilton network."
      />
      {warehousesQ.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {(warehousesQ.data ?? []).map((w) => (
            <Card key={w.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-display text-lg">
                    <span className="text-[var(--primary)]">{w.code}</span>{" "}
                    {w.name}
                  </CardTitle>
                  <Badge variant="secondary">{w.capacityPct}% full</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <p>
                  {w.address.line1}, {w.address.city}, {w.address.province}{" "}
                  {w.address.postalCode}
                </p>
                <p>
                  Manager {w.managerName} · {w.phone}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {w.zones.map((z) => (
                    <Badge key={z.code} variant="outline">
                      {z.code} {z.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
