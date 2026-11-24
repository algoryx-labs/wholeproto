"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@calgarywholesale/ui";
import { usePhoneFrame } from "./phone-frame-context";

export function MobileSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { screenEl } = usePhoneFrame();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        container={screenEl}
        side="bottom"
        className="max-h-[85%] gap-0"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="overflow-y-auto px-5 pb-8">{children}</div>
      </SheetContent>
    </Sheet>
  );
}