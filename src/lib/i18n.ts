"use client";

import { useCallback } from "react";
import { en } from "@/locales/en";
import { fr } from "@/locales/fr";
import type { Locale } from "@/types/i18n";

const translations = { en, fr };

type TranslationValue = string | Record<string, unknown>;

export function useI18n(locale: Locale = "en") {
  const t = useCallback(
    (path: string): string => {
      const keys = path.split(".");
      let value: TranslationValue = translations[locale];

      for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
          value = (value as Record<string, unknown>)[key] as TranslationValue;
        } else {
          // Fallback to English if key not found
          value = translations.en;
          for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
              value = (value as Record<string, unknown>)[k] as TranslationValue;
            } else {
              return path; // Return path if translation not found
            }
          }
          return value as string;
        }
      }

      return typeof value === "string" ? value : path;
    },
    [locale],
  );

  return { t, locale };
}

// Context hook to provide locale globally
export function useLocale() {
  // This will be provided by LocaleProvider
  return "en" as const;
}
