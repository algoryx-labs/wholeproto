"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lakeshoreCustomer } from "@westwinds/data";

export type SessionRole = "Buyer" | "Approver" | "Account admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  customerId: string;
  customerName: string;
}

interface SessionState {
  signedIn: boolean;
  user: SessionUser | null;
  role: SessionRole;
  approvalLimit: number;
  locationId: string;
  signIn: (email?: string) => void;
  signOut: () => void;
  setRole: (role: SessionRole) => void;
  setLocationId: (locationId: string) => void;
}

const lakeshoreBuyer = lakeshoreCustomer.users.find((u) => u.isPrimary)!;
const defaultLocationId = lakeshoreCustomer.locations[0]!.id;

function limitForRole(role: SessionRole): number {
  return role === "Buyer" ? 5000 : Number.POSITIVE_INFINITY;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      signedIn: false,
      user: null,
      role: "Buyer",
      approvalLimit: 5000,
      locationId: defaultLocationId,
      signIn: (email) => {
        const match =
          lakeshoreCustomer.users.find((u) => u.email === email) ??
          lakeshoreBuyer;
        set({
          signedIn: true,
          user: {
            id: match.id,
            name: match.name,
            email: match.email,
            customerId: lakeshoreCustomer.id,
            customerName: lakeshoreCustomer.name,
          },
          role: "Buyer",
          approvalLimit: 5000,
          locationId: defaultLocationId,
        });
      },
      signOut: () =>
        set({
          signedIn: false,
          user: null,
          role: "Buyer",
          approvalLimit: 5000,
        }),
      setRole: (role) =>
        set({
          role,
          approvalLimit: limitForRole(role),
        }),
      setLocationId: (locationId) => set({ locationId }),
    }),
    { name: "ww-b2b:session" },
  ),
);
