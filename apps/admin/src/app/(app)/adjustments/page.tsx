"use client";

import { SlidersHorizontal } from "lucide-react";
import { StubPage } from "@/components/stub-page";

export default function AdjustmentsPage() {
  return (
    <StubPage
      title="Adjustments"
      description="Cycle counts, damage, and expiry write-offs."
      message="Adjustment workflows are stubbed for this prototype. Use Transfers to move stock between warehouses."
      icon={SlidersHorizontal}
    />
  );
}
