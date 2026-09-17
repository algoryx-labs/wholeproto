"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@westwinds/data";
import {
  Badge,
  PageHeader,
  SectionCard,
  Skeleton,
} from "@westwinds/ui";

export default function RolesPage() {
  const q = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Permission sets used by View as role simulation."
      />
      {q.isLoading ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {(q.data ?? []).map((role) => (
            <SectionCard
              key={role.id}
              title={role.name}
              description={role.description}
            >
              <div className="flex flex-wrap gap-1.5">
                {role.permissions
                  .filter((p) => p.actions.includes("view"))
                  .map((p) => (
                    <Badge key={p.module} variant="outline">
                      {p.module}
                    </Badge>
                  ))}
              </div>
              {role.warehouseScoped ? (
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                  Warehouse-scoped
                </p>
              ) : null}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
