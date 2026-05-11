"use client";

import { useCallback } from "react";
import { en } from "@/locales/en";
import { fr } from "@/locales/fr";

type Locale = "en" | "fr";

const translations = { en, fr };

export function useI18n(locale: Locale = "en") {
  const t = useCallback(
    (path: string): string => {
      const keys = path.split(".");
      let value: any = translations[locale];

      for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          // Fallback to English if key not found
          value = translations.en;
          for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
              value = value[k];
            } else {
              return path; // Return path if translation not found
            }
          }
          return value;
        }
      }

      return typeof value === "string" ? value : path;
    },
    [locale]
  );

  return { t, locale };
}

// Context hook to provide locale globally
export function useLocale() {
  // This will be provided by LocaleProvider
  return "en" as const;
}
