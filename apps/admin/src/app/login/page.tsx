"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { brand } from "@westwinds/lib";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Logo,
} from "@westwinds/ui";
import { VIEW_AS_ROLES } from "@/lib/roles";
import { useSessionStore } from "@/stores/session-store";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useSessionStore((s) => s.signIn);
  const signedIn = useSessionStore((s) => s.signedIn);
  const [email, setEmail] = React.useState("amelia.west@westwinds.ca");
  const [password, setPassword] = React.useState("demo");
  const [roleId, setRoleId] = React.useState("role-owner");
  const [loading, setLoading] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated && signedIn) router.replace("/");
  }, [hydrated, signedIn, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    signIn({ email, roleId });
    router.replace("/");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#027BC2_0%,#0E8911_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo size="lg" wordmark={brand.adminAppName} />
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Control inventory across Calgary warehouses
          </h1>
          <p className="max-w-md text-white/80">
            Demo console for stock matrices, transfers, B2B + app orders, and
            catalog publishing — no live backend required.
          </p>
        </div>
        <p className="text-sm text-white/60">
          {brand.companyName} · Cash & Carry
        </p>
      </div>

      <div className="flex items-center justify-center bg-[var(--background)] p-6">
        <Card className="w-full max-w-md border-[var(--border)] shadow-[var(--shadow-card)]">
          <CardHeader>
            <div className="mb-2 lg:hidden">
              <Logo size="sm" wordmark={brand.adminAppName} />
            </div>
            <CardTitle className="font-display text-2xl">Sign in</CardTitle>
            <CardDescription>
              Any password works. Prefill is ready for the client demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label>Quick role</Label>
                <div className="flex flex-wrap gap-1.5">
                  {VIEW_AS_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoleId(r.id)}
                      className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                        roleId === r.id
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "bg-[var(--surface-sunken)] text-[var(--foreground)] hover:bg-[var(--primary-soft)]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in to Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
