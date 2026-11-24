import { mockDelay } from "@calgarywholesale/lib";
import type {
  ActivityEvent,
  AdminUser,
  Banner,
  DailySales,
  Promotion,
  QuickBooksSyncLog,
  Role,
} from "../types";
import { activityEvents } from "../seed/activity";
import { adminUsers, roles } from "../seed/admin";
import { dailySales } from "../seed/daily-sales";
import { banners, promotions } from "../seed/promotions";
import { quickBooksLogs } from "../seed/quickbooks";

export async function getPromotions(filters: {
  activeOnly?: boolean;
  channel?: Promotion["channel"];
} = {}): Promise<Promotion[]> {
  await mockDelay();
  let list = [...promotions];
  if (filters.activeOnly) {
    list = list.filter((p) => p.active);
  }
  if (filters.channel) {
    list = list.filter(
      (p) => p.channel === filters.channel || p.channel === "both",
    );
  }
  return list;
}

export async function getBanners(activeOnly = true): Promise<Banner[]> {
  await mockDelay();
  const list = activeOnly ? banners.filter((b) => b.active) : [...banners];
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getDailySales(days = 90): Promise<DailySales[]> {
  await mockDelay();
  return dailySales.slice(Math.max(0, dailySales.length - days));
}

export async function getActivity(limit = 50): Promise<ActivityEvent[]> {
  await mockDelay();
  return activityEvents.slice(0, limit);
}

export async function getQuickBooksLogs(
  limit = 30,
): Promise<QuickBooksSyncLog[]> {
  await mockDelay();
  return quickBooksLogs.slice(0, limit);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  await mockDelay();
  return adminUsers;
}

export async function getRoles(): Promise<Role[]> {
  await mockDelay();
  return roles;
}
