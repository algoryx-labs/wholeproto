"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@westwinds/lib";
import { Input } from "../components/input";
import { Button } from "../components/button";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onClear?: () => void;
  showClear?: boolean;
  filters?: React.ReactNode;
}

function FilterBar({
  className,
  search = "",
  onSearchChange,
  searchPlaceholder = "Search…",
  onClear,
  showClear,
  filters,
  ...props
}: FilterBarProps) {
  const hasClear =
    showClear ??
    Boolean(search || onClear);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtle-foreground)]" />
        <Input
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
          aria-label="Search"
        />
      </div>
      {filters ? (
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      ) : null}
      {hasClear && onClear ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}

export { FilterBar };
