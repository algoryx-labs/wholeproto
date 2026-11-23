import type { ActivityEvent } from "../types";
import { adminUsers } from "./admin";
import { daysAgo, faker } from "./helpers";
import { orders } from "./orders";
import { products } from "./products";
import { transfers } from "./transfers";

const verbs = [
  "approved",
  "created",
  "updated",
  "received",
  "shipped",
  "assigned",
  "synced",
  "cancelled",
  "published",
  "adjusted",
];

function buildActivity(): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (let i = 0; i < 200; i += 1) {
    const actor = adminUsers[i % adminUsers.length]!;
    const kind = i % 4;
    let entityType = "order";
    let entityId = orders[i % orders.length]!.id;
    let entityLabel = orders[i % orders.length]!.number;
    let action = `${actor.name.split(" ")[0]} ${actor.name.split(" ")[1]?.[0]}. ${verbs[i % verbs.length]} order ${entityLabel}`;

    if (kind === 1) {
      const transfer = transfers[i % transfers.length]!;
      entityType = "transfer";
      entityId = transfer.id;
      entityLabel = transfer.number;
      action = `${actor.name.split(" ")[0]} ${actor.name.split(" ")[1]?.[0]}. ${verbs[i % verbs.length]} transfer ${entityLabel}`;
    } else if (kind === 2) {
      const product = products[i % products.length]!;
      entityType = "product";
      entityId = product.id;
      entityLabel = product.sku;
      action = `${actor.name.split(" ")[0]} ${actor.name.split(" ")[1]?.[0]}. ${verbs[i % verbs.length]} product ${product.name}`;
    } else if (kind === 3) {
      entityType = "customer";
      entityId = `b2b-${String((i % 25) + 1).padStart(3, "0")}`;
      entityLabel = entityId;
      action = `${actor.name.split(" ")[0]} ${actor.name.split(" ")[1]?.[0]}. updated B2B account ${entityLabel}`;
    }

    events.push({
      id: `act-${String(i + 1).padStart(4, "0")}`,
      actorId: actor.id,
      actorName: actor.name,
      action,
      entityType,
      entityId,
      entityLabel,
      detail: i % 6 === 0 ? faker.lorem.sentence() : undefined,
      createdAt: daysAgo(i % 90, 6 + (i % 14)),
    });
  }

  // Pin a recognizable demo event near the top chronologically
  events[0] = {
    id: "act-0001",
    actorId: "adm-02",
    actorName: "Priya Singh",
    action: "Priya S. approved transfer TRF-00012",
    entityType: "transfer",
    entityId: "trf-00012",
    entityLabel: "TRF-00012",
    detail: "Brampton → Mississauga produce replenishment",
    createdAt: daysAgo(1, 10),
  };

  return events.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export const activityEvents: ActivityEvent[] = buildActivity();
