"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { LocaleProvider } from "@/lib/locale-context";
import { LampToggle } from "@/components/ui/LampToggle";

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
