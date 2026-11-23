"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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
  Textarea,
} from "@westwinds/ui";

const STEPS = ["Business", "Locations", "Buyers", "Review"] as const;

export default function RequestAccessPage() {
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({
    businessName: "",
    hst: "",
    city: "Toronto",
    volume: "",
    buyerName: "",
    buyerEmail: "",
    notes: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
              <CheckCircle2 className="size-7" />
            </span>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-semibold">
                Application received
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Calgary Wholesale credit will review {form.businessName || "your account"}{" "}
                within one business day. You will receive a Trade login at{" "}
                {form.buyerEmail || "your buyer email"} once approved.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3">
          <Logo
            size="md"
            wordmark={brand.b2bAppName}
            className="self-center"
          />
          <div>
            <CardTitle className="font-display text-xl">Request Trade access</CardTitle>
            <CardDescription>
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </CardDescription>
          </div>
          <div className="flex gap-1.5 pt-1">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= step ? "bg-[var(--primary)]" : "bg-[var(--surface-sunken)]"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="biz">Legal business name</Label>
                <Input
                  id="biz"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="e.g. Harbour Street Café Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hst">GST / BN</Label>
                <Input
                  id="hst"
                  value={form.hst}
                  onChange={(e) => update("hst", e.target.value)}
                  placeholder="123456789RT0001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vol">Expected monthly volume (CAD)</Label>
                <Input
                  id="vol"
                  value={form.volume}
                  onChange={(e) => update("volume", e.target.value)}
                  placeholder="8000"
                />
              </div>
            </>
          ) : null}
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="city">Primary delivery city</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Dock / receiving notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Receiving hours, lift-gate needs, preferred warehouse…"
                  rows={4}
                />
              </div>
            </>
          ) : null}
          {step === 2 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="buyer">Primary buyer name</Label>
                <Input
                  id="buyer"
                  value={form.buyerName}
                  onChange={(e) => update("buyerName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Buyer email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.buyerEmail}
                  onChange={(e) => update("buyerEmail", e.target.value)}
                />
              </div>
            </>
          ) : null}
          {step === 3 ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">Business</dt>
                <dd className="font-medium">{form.businessName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">City</dt>
                <dd className="font-medium">{form.city || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">Buyer</dt>
                <dd className="font-medium">
                  {form.buyerName || "—"} · {form.buyerEmail || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">Volume</dt>
                <dd className="font-medium">
                  {form.volume ? `$${form.volume}/mo` : "—"}
                </dd>
              </div>
            </dl>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/login">Cancel</Link>
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={() => setDone(true)}>
                Submit application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
