"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider, Toaster } from "@westwinds/ui";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(makeQueryClient);

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider delayDuration={150}>
        {children}
        <Toaster position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
