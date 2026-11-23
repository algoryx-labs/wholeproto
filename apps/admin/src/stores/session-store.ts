"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WarehouseScopeId = "all" | string;

interface SessionState {
  email: string;
  roleId: string;
  warehouseScopeId: WarehouseScopeId;
  signedIn: boolean;
  setEmail: (email: string) => void;
  setRoleId: (roleId: string) => void;
  setWarehouseScopeId: (id: WarehouseScopeId) => void;
  signIn: (payload: { email: string; roleId: string }) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      email: "amelia.west@westwinds.ca",
      roleId: "role-owner",
      warehouseScopeId: "all",
      signedIn: false,
      setEmail: (email) => set({ email }),
      setRoleId: (roleId) => set({ roleId }),
      setWarehouseScopeId: (warehouseScopeId) => set({ warehouseScopeId }),
      signIn: ({ email, roleId }) =>
        set({ email, roleId, signedIn: true }),
      signOut: () => set({ signedIn: false }),
    }),
    { name: "ww-admin:session" },
  ),
);
