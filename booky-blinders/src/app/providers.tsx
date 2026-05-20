"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LampToggle } from "@/components/ui/LampToggle";
import { LocaleProvider } from "@/lib/locale-context";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LocaleProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        {mounted && <LampToggle />}
      </ThemeProvider>
    </LocaleProvider>
  );
}
