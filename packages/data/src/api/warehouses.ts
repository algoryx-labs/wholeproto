import { mockDelay } from "@westwinds/lib";
import type { Warehouse } from "../types";
import { warehouses } from "../seed/warehouses";

export async function getWarehouses(): Promise<Warehouse[]> {
  await mockDelay();
  return warehouses;
}

export async function getWarehouse(id: string): Promise<Warehouse | undefined> {
  await mockDelay();
  return warehouses.find((w) => w.id === id || w.code === id);
}
