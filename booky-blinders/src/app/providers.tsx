"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { LampToggle } from "@/components/ui/LampToggle";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <LampToggle />
    </ThemeProvider>
  );
}
