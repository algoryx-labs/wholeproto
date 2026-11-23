"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useSessionStore } from "@/stores/session-store";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const signIn = useSessionStore((s) => s.signIn);
  const signedIn = useSessionStore((s) => s.signedIn);
  const [email, setEmail] = React.useState("buyer@lakeshorefresh.ca");
  const [password, setPassword] = React.useState("demo");

  React.useEffect(() => {
    if (signedIn) {
      router.replace(params.get("next") || "/");
    }
  }, [signedIn, router, params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email);
    router.replace(params.get("next") || "/");
  };

  return (
    <Card className="w-full max-w-md border-[var(--border)] shadow-[var(--shadow-card)]">
      <CardHeader className="space-y-3">
        <Logo wordmark={brand.b2bAppName} />
        <div>
          <CardTitle className="font-display text-xl">Sign in</CardTitle>
          <CardDescription>
            Wholesale ordering for Lakeshore Fresh Grocers and partner accounts.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              Demo: any password works for the prefilled Lakeshore buyer.
            </p>
          </div>
          <Button type="submit" className="w-full">
            Sign in to Trade
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          New wholesale account?{" "}
          <Link
            href="/request-access"
            className="font-medium text-[var(--primary)] hover:underline"
          >
            Request access
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--accent-soft),_transparent_55%),linear-gradient(180deg,_var(--background),_#E3F5E4)] px-4 py-12">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-[var(--radius-md)] bg-[var(--surface)]" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
