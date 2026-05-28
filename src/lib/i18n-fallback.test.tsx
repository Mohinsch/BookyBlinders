/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("useI18n fallback", () => {
  it("falls back to English when the locale key is missing", async () => {
    vi.resetModules();
    vi.doMock("@/locales/fr", () => ({ fr: { header: {} } }));
    vi.doMock("@/locales/en", () => ({
      en: { header: { home: "Home" } },
    }));

    const { useI18n } = await import("./i18n");

    function Test() {
      const { t } = useI18n("fr");
      return <span>{t("header.home")}</span>;
    }

    render(<Test />);

    expect(screen.getByText("Home")).toBeTruthy();
  });
});
