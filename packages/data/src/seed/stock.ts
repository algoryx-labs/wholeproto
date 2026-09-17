import type { StockHealth, StockLevel, StockMovement } from "../types";
import { daysAgo, faker, pickHealth } from "./helpers";
import { HONEYCRISP_SKU, products } from "./products";
import { warehouses } from "./warehouses";

function qtyForHealth(
  health: StockHealth,
  reorderPoint: number,
): { onHand: number; allocated: number } {
  if (health === "out_of_stock") {
    return { onHand: 0, allocated: 0 };
  }
  if (health === "low_stock") {
    const onHand = faker.number.int({
      min: Math.max(1, Math.floor(reorderPoint * 0.2)),
      max: Math.max(2, Math.floor(reorderPoint * 0.85)),
    });
    const allocated = Math.min(
      onHand,
      faker.number.int({ min: 0, max: Math.ceil(onHand * 0.4) }),
    );
    return { onHand, allocated };
  }
  const onHand = faker.number.int({
    min: reorderPoint + 10,
    max: reorderPoint * 4 + 40,
  });
  const allocated = faker.number.int({
    min: 0,
    max: Math.floor(onHand * 0.25),
  });
  return { onHand, allocated };
}

function binFor(warehouseCode: string, index: number): string {
  const aisle = String.fromCharCode(65 + (index % 8));
  const bay = String((index % 24) + 1).padStart(2, "0");
  return `${warehouseCode}-${aisle}${bay}`;
}

function buildStockLevels(): StockLevel[] {
  const levels: StockLevel[] = [];
  let i = 0;

  for (const product of products) {
    for (const warehouse of warehouses) {
      let health = pickHealth(i);
      // Demo story: Honeycrisp low at MDC, healthy at BRW, uneven elsewhere
      if (product.sku === HONEYCRISP_SKU) {
        if (warehouse.code === "MDC") health = "low_stock";
        else if (warehouse.code === "BRW") health = "in_stock";
        else if (warehouse.code === "ETX") health = "out_of_stock";
        else health = "in_stock";
      }

      const { onHand, allocated } = qtyForHealth(health, product.reorderPoint);
      const available = Math.max(0, onHand - allocated);

      levels.push({
        id: `stk-${product.id}-${warehouse.id}`,
        productId: product.id,
        warehouseId: warehouse.id,
        onHand,
        allocated,
        available,
        binLocation: binFor(warehouse.code, i),
        reorderPoint: product.reorderPoint,
        health,
        updatedAt: daysAgo(i % 7, 8 + (i % 10)),
      });
      i += 1;
    }
  }

  return levels;
}

export const stockLevels: StockLevel[] = buildStockLevels();

const movementTypes = [
  "received",
  "sold_b2b",
  "sold_b2c",
  "transfer_out",
  "transfer_in",
  "adjustment_damaged",
  "adjustment_expired",
  "adjustment_count",
  "return",
] as const;

function buildMovements(): StockMovement[] {
  const movements: StockMovement[] = [];
  const sampleProducts = products.filter((_, idx) => idx % 3 === 0);

  for (let n = 0; n < 180; n += 1) {
    const product = sampleProducts[n % sampleProducts.length]!;
    const warehouse = warehouses[n % warehouses.length]!;
    const type = movementTypes[n % movementTypes.length]!;
    const signed =
      type === "sold_b2b" ||
      type === "sold_b2c" ||
      type === "transfer_out" ||
      type === "adjustment_damaged" ||
      type === "adjustment_expired"
        ? -1
        : 1;

    movements.push({
      id: `mov-${String(n + 1).padStart(4, "0")}`,
      productId: product.id,
      warehouseId: warehouse.id,
      type,
      quantity: signed * faker.number.int({ min: 1, max: 24 }),
      reference:
        type.startsWith("transfer")
          ? `TRF-${String((n % 35) + 1).padStart(5, "0")}`
          : type.startsWith("sold")
            ? `ORD-${n}`
            : undefined,
      note:
        type === "adjustment_count"
          ? "Cycle count variance"
          : type === "adjustment_damaged"
            ? "Damaged in handling"
            : undefined,
      createdAt: daysAgo(n % 90, 7 + (n % 12)),
      createdBy: n % 2 === 0 ? "Priya Singh" : "Marcus Chen",
    });
  }

  return movements;
}

export const stockMovements: StockMovement[] = buildMovements();

export function getStockMatrixRows(): Array<{
  productId: string;
  sku: string;
  name: string;
  byWarehouse: Record<
    string,
    Pick<StockLevel, "onHand" | "allocated" | "available" | "health" | "binLocation">
  >;
  totalOnHand: number;
  totalAllocated: number;
  totalAvailable: number;
  reorderPoint: number;
}> {
  return products.map((product) => {
    const levels = stockLevels.filter((s) => s.productId === product.id);
    const byWarehouse: Record<
      string,
      Pick<StockLevel, "onHand" | "allocated" | "available" | "health" | "binLocation">
    > = {};
    let totalOnHand = 0;
    let totalAllocated = 0;
    let totalAvailable = 0;

    for (const level of levels) {
      byWarehouse[level.warehouseId] = {
        onHand: level.onHand,
        allocated: level.allocated,
        available: level.available,
        health: level.health,
        binLocation: level.binLocation,
      };
      totalOnHand += level.onHand;
      totalAllocated += level.allocated;
      totalAvailable += level.available;
    }

    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      byWarehouse,
      totalOnHand,
      totalAllocated,
      totalAvailable,
      reorderPoint: product.reorderPoint,
    };
  });
}
