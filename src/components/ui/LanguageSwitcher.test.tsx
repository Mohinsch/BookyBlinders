/** @vitest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider, useLocaleContext } from "@/lib/locale-context";
import { LanguageSwitcher } from "./LanguageSwitcher";

function LocaleValue() {
  const { locale } = useLocaleContext();
  return <span data-testid="locale">{locale}</span>;
}

describe("LanguageSwitcher", () => {
  it("toggles the locale through the context provider", () => {
    render(
      <LocaleProvider>
        <LanguageSwitcher />
        <LocaleValue />
      </LocaleProvider>,
    );

    expect(screen.getByTestId("locale").textContent).toBe("en");

    fireEvent.click(screen.getByRole("button", { name: "Switch to French" }));
    expect(screen.getByTestId("locale").textContent).toBe("fr");

    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(screen.getByTestId("locale").textContent).toBe("en");
  });
});
