"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQuickBooksLogs } from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  SectionCard,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";

export default function IntegrationsPage() {
  const [syncing, setSyncing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const logsQ = useQuery({
    queryKey: ["qb-logs"],
    queryFn: () => getQuickBooksLogs(30),
  });

  async function syncNow() {
    setSyncing(true);
    setProgress(0);
    const started = Date.now();
    await new Promise<void>((resolve) => {
      const tick = () => {
        const pct = Math.min(100, ((Date.now() - started) / 2000) * 100);
        setProgress(pct);
        if (pct >= 100) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    setSyncing(false);
    toast.success("QuickBooks sync complete", {
      description: "Invoices and customers refreshed.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Accounting and fulfilment connections for Wholesale Calgary Admin."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>QuickBooks Online</CardTitle>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Wholesale Calgary company file
            </p>
          </div>
          <StatusBadge status="active" label="Connected" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Button type="button" onClick={syncNow} disabled={syncing}>
            {syncing ? "Syncing…" : "Sync now"}
          </Button>
          {syncing ? (
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
              <div
                className="h-full bg-[var(--primary)] transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <SectionCard title="Sync log">
        {logsQ.isLoading ? (
          <Skeleton className="h-48" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(logsQ.data ?? []).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="capitalize">{log.entity}</TableCell>
                  <TableCell>{log.entityLabel}</TableCell>
                  <TableCell className="max-w-[240px] truncate text-[var(--muted-foreground)]">
                    {log.message}
                  </TableCell>
                  <TableCell>{formatDate(log.syncedAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
