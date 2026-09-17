import { products } from "./seed/products";
import { orders } from "./seed/orders";

export type * from "./types";

export {
  warehouses,
  warehouseByCode,
  warehouseById,
  categories,
  categoryById,
  products,
  productById,
  productBySku,
  HONEYCRISP_SKU,
  honeycrispProduct,
  stockLevels,
  stockMovements,
  getStockMatrixRows,
  transfers,
  transferById,
  transferByNumber,
  priceGroups,
  priceGroupById,
  b2bCustomers,
  b2bCustomerById,
  lakeshoreCustomer,
  LAKESHORE_CUSTOMER_ID,
  consumers,
  consumerById,
  orders,
  orderById,
  orderByNumber,
  demoB2BOrder,
  DEMO_B2B_ORDER_NUMBER,
  invoices,
  invoiceById,
  promotions,
  banners,
  roles,
  adminUsers,
  roleById,
  adminUserById,
  activityEvents,
  quickBooksLogs,
  dailySales,
  HST_RATE,
  DEMO_ANCHOR,
} from "./seed";

export {
  getWarehouses,
  getWarehouse,
  getCategories,
  getProducts,
  getProduct,
  getStockLevels,
  getStockMatrix,
  getLowStockAlerts,
  getTransfers,
  getTransfer,
  getOrders,
  getOrder,
  getInvoices,
  getPriceGroups,
  getB2BCustomers,
  getB2BCustomer,
  getConsumers,
  getConsumer,
  getPromotions,
  getBanners,
  getDailySales,
  getActivity,
  getQuickBooksLogs,
  getAdminUsers,
  getRoles,
} from "./api";

export type { ProductFilters, StockFilters, OrderFilters } from "./api";

export const DATA_PACKAGE_VERSION = "0.1.0";

export function getDataPackageHealth(): {
  ok: true;
  version: string;
  productCount: number;
  orderCount: number;
} {
  return {
    ok: true,
    version: DATA_PACKAGE_VERSION,
    productCount: products.length,
    orderCount: orders.length,
  };
}
