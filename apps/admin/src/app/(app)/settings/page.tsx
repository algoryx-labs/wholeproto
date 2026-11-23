"use client";

import { Settings } from "lucide-react";
import { StubPage } from "@/components/stub-page";

export default function SettingsPage() {
  return (
    <StubPage
      title="Settings"
      description="Company profile, tax, and notification preferences."
      message="Company settings are out of scope for this frontend prototype. Currency is CAD with 5% GST."
      icon={Settings}
    />
  );
}
