"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--surface)] group-[.toaster]:text-[var(--foreground)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-[var(--shadow-pop)]",
          description: "group-[.toast]:text-[var(--muted-foreground)]",
          actionButton:
            "group-[.toast]:bg-[var(--primary)] group-[.toast]:text-[var(--primary-foreground)]",
          cancelButton:
            "group-[.toast]:bg-[var(--surface-sunken)] group-[.toast]:text-[var(--muted-foreground)]",
          success: "group-[.toaster]:border-[var(--success)]",
          error: "group-[.toaster]:border-[var(--danger)]",
          warning: "group-[.toaster]:border-[var(--warning)]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
