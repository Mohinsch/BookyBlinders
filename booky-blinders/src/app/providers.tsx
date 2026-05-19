"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { LampToggle } from "@/components/ui/LampToggle";
import { LocaleProvider } from "@/lib/locale-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <LampToggle />
      </ThemeProvider>
    </LocaleProvider>
  );
}
