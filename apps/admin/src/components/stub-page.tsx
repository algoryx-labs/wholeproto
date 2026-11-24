"use client";

import type { LucideIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@calgarywholesale/ui";

export function StubPage({
  title,
  description,
  message,
  icon,
}: {
  title: string;
  description: string;
  message: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface)]">
        <EmptyState icon={icon} title={title} message={message} />
      </div>
    </div>
  );
}
