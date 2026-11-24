import type { Address } from "@calgarywholesale/data";

export interface StoreHours {
  open: string;
  close: string;
  /** Display e.g. "8:00 AM – 8:00 PM" */
  label: string;
}

export interface StoreLocation {
  /** Maps to shared warehouse id used on orders */
  id: string;
  code: string;
  name: string;
  line1: string;
  city: string;
  province: "AB";
  postalCode: string;
  phone: string;
  hours: StoreHours;
  /** Rough Calgary quadrant for nearest matching */
  quadrant: "NE" | "SE" | "NW" | "SW" | "CENTRE";
  distanceKm: number;
}

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: "wh-mdc",
    code: "CNE",
    name: "NE Calgary Cash & Carry",
    line1: "2915 19 St NE",
    city: "Calgary",
    province: "AB",
    postalCode: "T2E 8N5",
    phone: "+1 (403) 861-2000",
    hours: { open: "08:00", close: "20:00", label: "8:00 AM – 8:00 PM" },
    quadrant: "NE",
    distanceKm: 4.2,
  },
  {
    id: "wh-brw",
    code: "CSE",
    name: "SE Calgary Warehouse",
    line1: "4312 54 Ave SE",
    city: "Calgary",
    province: "AB",
    postalCode: "T2C 2A2",
    phone: "+1 (403) 555-0142",
    hours: { open: "07:00", close: "19:00", label: "7:00 AM – 7:00 PM" },
    quadrant: "SE",
    distanceKm: 6.8,
  },
  {
    id: "wh-etx",
    code: "CNW",
    name: "NW Calgary Depot",
    line1: "3820 32 Ave NW",
    city: "Calgary",
    province: "AB",
    postalCode: "T2L 1Y4",
    phone: "+1 (403) 555-0188",
    hours: { open: "08:00", close: "18:00", label: "8:00 AM – 6:00 PM" },
    quadrant: "NW",
    distanceKm: 8.1,
  },
  {
    id: "wh-hmd",
    code: "CSW",
    name: "SW Calgary Hub",
    line1: "1212 37 St SW",
    city: "Calgary",
    province: "AB",
    postalCode: "T3C 1S2",
    phone: "+1 (403) 555-0199",
    hours: { open: "09:00", close: "20:00", label: "9:00 AM – 8:00 PM" },
    quadrant: "SW",
    distanceKm: 9.4,
  },
];

function parseMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function isStoreOpenNow(
  hours: StoreHours,
  now = new Date(),
): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= parseMinutes(hours.open) && mins < parseMinutes(hours.close);
}

export function storeOpenStatus(hours: StoreHours, now = new Date()) {
  const open = isStoreOpenNow(hours, now);
  return {
    open,
    label: open ? "Open now" : "Closed",
    hoursLabel: hours.label,
  };
}

function guessQuadrant(address: Address | null): StoreLocation["quadrant"] {
  if (!address) return "NE";
  const hay = `${address.line1} ${address.postalCode} ${address.label}`.toUpperCase();
  if (/\bNE\b|T2E|T1Y|T2A/.test(hay)) return "NE";
  if (/\bSE\b|T2C|T2Z|T2X/.test(hay)) return "SE";
  if (/\bNW\b|T2L|T3B|T2N/.test(hay)) return "NW";
  if (/\bSW\b|T3C|T2T|T3H/.test(hay)) return "SW";
  if (/CENTRE|DOWNTOWN|T2P|T2G/.test(hay)) return "CENTRE";
  return "NE";
}

/** Rank stores by proximity to the selected address (demo heuristic). */
export function storesNearAddress(address: Address | null): StoreLocation[] {
  const q = guessQuadrant(address);
  return [...STORE_LOCATIONS]
    .map((s) => {
      let distanceKm = s.distanceKm;
      if (s.quadrant === q) distanceKm = Math.max(1.2, s.distanceKm * 0.45);
      else if (
        (q === "NE" && s.quadrant === "SE") ||
        (q === "SE" && s.quadrant === "NE") ||
        (q === "NW" && s.quadrant === "SW") ||
        (q === "SW" && s.quadrant === "NW")
      ) {
        distanceKm = s.distanceKm * 0.85;
      }
      return { ...s, distanceKm: Math.round(distanceKm * 10) / 10 };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function nearestStore(address: Address | null): StoreLocation {
  return storesNearAddress(address)[0]!;
}

export function getStoreById(id: string | null | undefined) {
  return STORE_LOCATIONS.find((s) => s.id === id) ?? STORE_LOCATIONS[0]!;
}
