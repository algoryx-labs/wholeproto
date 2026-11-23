export interface WarehouseZone {
  code: string;
  name: string;
}

export interface Warehouse {
  id: string;
  code: "MDC" | "BRW" | "ETX" | "HMD";
  name: string;
  address: {
    line1: string;
    city: string;
    province: "ON" | "AB";
    postalCode: string;
    country: "CA";
  };
  managerName: string;
  managerEmail: string;
  capacityPct: number;
  zones: WarehouseZone[];
  phone: string;
}
