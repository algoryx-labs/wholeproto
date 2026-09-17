import type {
  StockHealth,
  StockMovementType,
  TransferStatus,
} from "./status";

export interface StockLevel {
  id: string;
  productId: string;
  warehouseId: string;
  onHand: number;
  allocated: number;
  available: number;
  binLocation: string;
  reorderPoint: number;
  health: StockHealth;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  warehouseId: string;
  type: StockMovementType;
  quantity: number;
  reference?: string;
  note?: string;
  createdAt: string;
  createdBy: string;
}

export interface TransferLine {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  requestedQty: number;
  shippedQty: number;
  receivedQty: number;
}

export interface Transfer {
  id: string;
  number: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  status: TransferStatus;
  lines: TransferLine[];
  requestedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  receivedAt?: string;
}
