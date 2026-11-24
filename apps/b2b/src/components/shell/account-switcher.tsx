"use client";

import { Building2, ChevronDown, MapPin } from "lucide-react";
import {
  lakeshoreCustomer,
  LAKESHORE_CUSTOMER_ID,
} from "@calgarywholesale/data";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@calgarywholesale/ui";
import {
  type SessionRole,
  useSessionStore,
} from "@/stores/session-store";

const ROLES: SessionRole[] = ["Buyer", "Approver", "Account admin"];

export function AccountSwitcher() {
  const user = useSessionStore((s) => s.user);
  const role = useSessionStore((s) => s.role);
  const locationId = useSessionStore((s) => s.locationId);
  const setRole = useSessionStore((s) => s.setRole);
  const setLocationId = useSessionStore((s) => s.setLocationId);
  const signOut = useSessionStore((s) => s.signOut);
  const location =
    lakeshoreCustomer.locations.find((l) => l.id === locationId) ??
    lakeshoreCustomer.locations[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-[220px] gap-2">
          <Building2 className="size-3.5 shrink-0" />
          <span className="truncate text-left">
            <span className="block truncate text-xs font-medium leading-tight">
              Lakeshore Fresh
            </span>
            <span className="block truncate text-[10px] font-normal text-[var(--muted-foreground)]">
              {location.label}
            </span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          {user?.name ?? "Buyer"}
          <span className="mt-0.5 block text-xs font-normal text-[var(--muted-foreground)]">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-[var(--muted-foreground)]">
          Account
        </DropdownMenuLabel>
        <DropdownMenuItem disabled>
          <Building2 className="size-3.5" />
          {lakeshoreCustomer.name}
          <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">
            {LAKESHORE_CUSTOMER_ID.replace("b2b-", "").toUpperCase()}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-[var(--muted-foreground)]">
          Delivery location
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={locationId}
          onValueChange={setLocationId}
        >
          {lakeshoreCustomer.locations.map((loc) => (
            <DropdownMenuRadioItem key={loc.id} value={loc.id}>
              <MapPin className="size-3.5" />
              {loc.label} · {loc.city}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-[var(--muted-foreground)]">
          Demo role
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(v) => setRole(v as SessionRole)}
        >
          {ROLES.map((r) => (
            <DropdownMenuRadioItem key={r} value={r}>
              {r}
              {r === "Buyer" ? " · $5,000 limit" : null}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
