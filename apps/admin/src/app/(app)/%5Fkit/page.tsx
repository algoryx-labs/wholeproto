"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Money,
  PageHeader,
  Qty,
  StatusBadge,
  StockHealth,
} from "@westwinds/ui";

export default function KitPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Component kit"
        description="Hidden reference surface for shared UI composites."
      />

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Badges & status</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="success">Success</Badge>
          <StatusBadge status="confirmed" />
          <StatusBadge status="low_stock" />
          <StatusBadge status="in_transit" />
          <StatusBadge status="delivered" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Money & qty</h2>
        <p className="text-sm">
          <Money amount={1284.5} /> · <Qty value={24} unit="case" />
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Stock health</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dots / cell / bar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <StockHealth
              variant="dots"
              warehouses={[
                { warehouseCode: "MDC", onHand: 4, reorderPoint: 20 },
                { warehouseCode: "BRW", onHand: 80, reorderPoint: 20 },
                { warehouseCode: "ETX", onHand: 0, reorderPoint: 20 },
                { warehouseCode: "HMD", onHand: 45, reorderPoint: 20 },
              ]}
            />
            <StockHealth variant="cell" onHand={4} reorderPoint={20} />
            <div className="w-40">
              <StockHealth variant="bar" onHand={4} reorderPoint={20} />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
