"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { consumers } from "@westwinds/data";
import { brand } from "@westwinds/lib";
import { Button, Input, Label } from "@westwinds/ui";
import { toast } from "sonner";
import { AddressPickerSheet } from "@/components/address-sheet";
import { useSessionStore } from "@/stores/session";

const DEMO_BASE = consumers[0]!;
const DEMO = {
  ...DEMO_BASE,
  addresses: [
    DEMO_BASE.addresses[0]!,
    {
      id: `${DEMO_BASE.id}-addr-2`,
      label: "Work",
      line1: "90 Burnhamthorpe Rd W",
      line2: "Suite 1400",
      city: "Mississauga",
      province: "ON" as const,
      postalCode: "L5B 3C3",
      country: "CA" as const,
    },
  ],
};

export default function LoginPage() {
  const router = useRouter();
  const setSignedIn = useSessionStore((s) => s.setSignedIn);
  const setConsumer = useSessionStore((s) => s.setConsumer);
  const setAddress = useSessionStore((s) => s.setAddress);
  const selectedAddress = useSessionStore((s) => s.address);

  const [phone, setPhone] = React.useState("+1 647 555 0140");
  const [step, setStep] = React.useState<"phone" | "otp" | "address">("phone");
  const [otp, setOtp] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [addressOpen, setAddressOpen] = React.useState(false);
  const finishing = React.useRef(false);

  const sendCode = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setStep("otp");
    toast.success("Code sent", {
      description: "Any 6 digits work for this prototype.",
    });
  };

  const verifyOtp = () => {
    if (otp.replace(/\D/g, "").length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setConsumer(DEMO);
    setAddress(DEMO.addresses[0] ?? null);
    setStep("address");
    setAddressOpen(true);
  };

  const finish = () => {
    if (finishing.current) return;
    finishing.current = true;
    setSignedIn(true);
    toast.success(`Welcome, ${DEMO.name.split(" ")[0]}`);
    router.replace("/");
  };

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-6">
      <p className="text-sm font-medium text-[var(--primary)]">{brand.mobileAppName}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
        Sign in with your phone
      </h1>
      <p className="mt-2 text-[15px] text-[var(--muted-foreground)]">
        We’ll text a one-time code. No password for the demo.
      </p>

      {step === "phone" || step === "otp" ? (
        <div className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 text-base"
              disabled={step !== "phone"}
            />
          </div>

          {step === "otp" ? (
            <div className="space-y-2">
              <Label htmlFor="otp">6-digit code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-12 tracking-[0.4em] text-base"
                placeholder="••••••"
                autoFocus
              />
            </div>
          ) : null}

          {step === "phone" ? (
            <Button
              size="lg"
              className="h-12 w-full text-base active:scale-[0.98]"
              disabled={sending || phone.length < 10}
              onClick={sendCode}
            >
              {sending ? "Sending…" : "Send code"}
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 w-full text-base active:scale-[0.98]"
              onClick={verifyOtp}
            >
              Verify & continue
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-[15px] text-[var(--muted-foreground)]">
            Confirm where we should deliver.
          </p>
          <Button
            size="lg"
            className="h-12 w-full text-base active:scale-[0.98]"
            onClick={() => setAddressOpen(true)}
          >
            Choose address
          </Button>
          <Button
            size="lg"
            variant="soft"
            className="h-12 w-full text-base active:scale-[0.98]"
            onClick={finish}
          >
            Use {DEMO.addresses[0]?.label ?? "Home"} & start shopping
          </Button>
        </div>
      )}

      <AddressPickerSheet
        open={addressOpen}
        onOpenChange={setAddressOpen}
        addresses={DEMO.addresses}
        selectedId={selectedAddress?.id ?? DEMO.addresses[0]?.id}
        onSelect={(a) => {
          setAddress(a);
          finish();
        }}
      />
    </div>
  );
}