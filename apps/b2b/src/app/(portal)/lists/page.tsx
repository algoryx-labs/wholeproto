"use client";

import Link from "next/link";
import { formatDate } from "@westwinds/lib";
import {
  Button,
  PageHeader,
  SectionCard,
} from "@westwinds/ui";
import { ListChecks } from "lucide-react";
import { SAVED_LISTS } from "@/lib/saved-lists";

export default function ListsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Order lists"
        description="Saved case mixes for weekly produce and monthly dry goods."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {SAVED_LISTS.map((list) => (
          <SectionCard
            key={list.id}
            title={list.name}
            description={list.description}
            actions={
              <Button asChild size="sm" variant="soft">
                <Link href={`/lists/${list.id}`}>Open</Link>
              </Button>
            }
            footer={
              <p className="text-xs text-[var(--muted-foreground)]">
                {list.items.length} SKUs · updated {formatDate(list.updatedAt)}
              </p>
            }
          >
            <ul className="space-y-1 text-sm text-[var(--muted-foreground)]">
              {list.items.slice(0, 3).map((item) => (
                <li key={item.sku} className="flex justify-between gap-2">
                  <span className="font-mono text-xs text-[var(--foreground)]">
                    {item.sku}
                  </span>
                  <span>{item.qty} cs</span>
                </li>
              ))}
              {list.items.length > 3 ? (
                <li className="text-xs">+{list.items.length - 3} more</li>
              ) : null}
            </ul>
          </SectionCard>
        ))}
      </div>
      {SAVED_LISTS.length === 0 ? (
        <SectionCard>
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-[var(--muted-foreground)]">
            <ListChecks className="size-6 text-[var(--primary)]" />
            No saved lists yet.
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
