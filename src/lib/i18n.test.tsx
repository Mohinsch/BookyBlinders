/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useI18n } from "./i18n";

function TestTranslation({
  locale,
  path,
}: {
  locale: "en" | "fr";
  path: string;
}) {
  const { t } = useI18n(locale);
  return <span>{t(path)}</span>;
}

describe("useI18n", () => {
  it("returns a translated string for a known key", () => {
    render(<TestTranslation locale="fr" path="header.home" />);
    expect(screen.getByText("Accueil")).toBeTruthy();
  });

  it("returns the path when translation is missing", () => {
    render(<TestTranslation locale="en" path="missing.key" />);
    expect(screen.getByText("missing.key")).toBeTruthy();
  });
});
