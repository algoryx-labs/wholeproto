"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getStockLevels,
  getTransfer,
  productById,
  warehouseById,
} from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
import {
  Badge,
  Button,
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
import {
  stockKey,
  useInventoryStore,
  type StockCell,
} from "@/stores/inventory-store";

export default function TransferDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const router = useRouter();

  const localTransfers = useInventoryStore((s) => s.localTransfers);
  const transferOverrides = useInventoryStore((s) => s.transferOverrides);
  const receivedTransferIds = useInventoryStore((s) => s.receivedTransferIds);
  const receiveTransfer = useInventoryStore((s) => s.receiveTransfer);
  const stockOverrides = useInventoryStore((s) => s.stockOverrides);

  const transferQ = useQuery({
    queryKey: ["transfer", id, localTransfers.length],
    queryFn: async () => {
      const local = localTransfers.find((t) => t.id === id || t.number === id);
      if (local) return local;
      return getTransfer(id);
    },
  });
  const stockQ = useQuery({
    queryKey: ["stock-for-receive"],
    queryFn: () => getStockLevels(),
  });

  const base = transferQ.data;
  const transfer = base
    ? { ...base, ...transferOverrides[base.id] }
    : undefined;
  const alreadyReceived =
    Boolean(transfer) && receivedTransferIds.includes(transfer!.id);

  function onReceive() {
    if (!transfer || alreadyReceived || !stockQ.data) return;
    const baseCells: Record<string, StockCell> = {};
    for (const s of stockQ.data) {
      baseCells[stockKey(s.productId, s.warehouseId)] = {
        onHand: s.onHand,
        available: s.available,
        allocated: s.allocated,
        health: s.health,
        binLocation: s.binLocation,
      };
    }
    for (const [k, v] of Object.entries(stockOverrides)) {
      baseCells[k] = v;
    }
    const reorderByProduct: Record<string, number> = {};
    for (const line of transfer.lines) {
      reorderByProduct[line.productId] =
        productById[line.productId]?.reorderPoint ?? 10;
    }
    receiveTransfer({ transfer, reorderByProduct, baseCells });
    toast.success("Transfer received", {
      description: "Inventory updated at source and destination.",
    });
    router.refresh();
  }

  if (transferQ.isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!transfer) {
    return (
      <PageHeader
        title="Transfer not found"
        description={`No transfer matches ${id}.`}
      />
    );
  }

  const from = warehouseById[transfer.fromWarehouseId];
  const to = warehouseById[transfer.toWarehouseId];
  const canReceive =
    !alreadyReceived &&
    (transfer.status === "requested" ||
      transfer.status === "in_transit" ||
      transfer.status === "partially_received");

  return (
    <div className="space-y-6">
      <PageHeader
        title={transfer.number}
        description={transfer.notes ?? "Inter-warehouse stock transfer"}
        breadcrumbs={[
          { label: "Transfers", href: "/transfers" },
          { label: transfer.number },
        ]}
        actions={
          canReceive ? (
            <Button type="button" onClick={onReceive}>
              Receive transfer
            </Button>
          ) : alreadyReceived || transfer.status === "received" ? (
            <StatusBadge status="received" />
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{from?.code}</Badge>
        <span className="text-[var(--muted-foreground)]">→</span>
        <Badge variant="soft">{to?.code}</Badge>
        <StatusBadge status={transfer.status} />
        <span className="text-sm text-[var(--muted-foreground)]">
          Requested by {transfer.requestedBy} · {formatDate(transfer.createdAt)}
        </span>
      </div>

      <SectionCard title="Lines">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Requested</TableHead>
              <TableHead className="text-right">Shipped</TableHead>
              <TableHead className="text-right">Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfer.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell className="font-medium">{line.productName}</TableCell>
                <TableCell className="tabular text-[var(--muted-foreground)]">
                  {line.sku}
                </TableCell>
                <TableCell className="text-right tabular">
                  {line.requestedQty}
                </TableCell>
                <TableCell className="text-right tabular">
                  {line.shippedQty}
                </TableCell>
                <TableCell className="text-right tabular">
                  {line.receivedQty}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
