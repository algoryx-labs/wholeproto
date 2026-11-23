import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PauseCircle,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@westwinds/lib";
import { Badge, type BadgeProps } from "../components/badge";

type StatusTone = NonNullable<BadgeProps["variant"]>;

interface StatusConfig {
  label: string;
  tone: StatusTone;
  icon: LucideIcon;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  draft: { label: "Draft", tone: "secondary", icon: Clock },
  pending: { label: "Pending", tone: "warning", icon: Clock },
  submitted: { label: "Submitted", tone: "info", icon: Clock },
  confirmed: { label: "Confirmed", tone: "info", icon: CheckCircle2 },
  processing: { label: "Processing", tone: "info", icon: Clock },
  picking: { label: "Picking", tone: "offer", icon: Clock },
  packed: { label: "Packed", tone: "soft", icon: CheckCircle2 },
  shipped: { label: "Shipped", tone: "info", icon: Truck },
  delivered: { label: "Delivered", tone: "success", icon: CheckCircle2 },
  completed: { label: "Completed", tone: "success", icon: CheckCircle2 },
  active: { label: "Active", tone: "success", icon: CheckCircle2 },
  inactive: { label: "Inactive", tone: "secondary", icon: PauseCircle },
  paused: { label: "Paused", tone: "warning", icon: PauseCircle },
  cancelled: { label: "Cancelled", tone: "danger", icon: XCircle },
  canceled: { label: "Cancelled", tone: "danger", icon: XCircle },
  failed: { label: "Failed", tone: "danger", icon: XCircle },
  rejected: { label: "Rejected", tone: "danger", icon: XCircle },
  low: { label: "Low", tone: "warning", icon: AlertCircle },
  critical: { label: "Critical", tone: "danger", icon: AlertCircle },
  healthy: { label: "Healthy", tone: "success", icon: CheckCircle2 },
  overdue: { label: "Overdue", tone: "danger", icon: AlertCircle },
  "on-hold": { label: "On hold", tone: "warning", icon: PauseCircle },
  "in-transit": { label: "In transit", tone: "info", icon: Truck },
};

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

function titleCase(status: string): string {
  return status
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
  label?: string;
  showIcon?: boolean;
}

function StatusBadge({
  status,
  label,
  showIcon = true,
  className,
  ...props
}: StatusBadgeProps) {
  const key = normalizeStatus(status);
  const config = STATUS_MAP[key] ?? {
    label: titleCase(status),
    tone: "secondary" as const,
    icon: AlertCircle,
  };
  const Icon = config.icon;

  return (
    <Badge
      variant={config.tone}
      className={cn("capitalize", className)}
      {...props}
    >
      {showIcon ? <Icon className="h-3 w-3" /> : null}
      {label ?? config.label}
    </Badge>
  );
}

export { StatusBadge, STATUS_MAP };
