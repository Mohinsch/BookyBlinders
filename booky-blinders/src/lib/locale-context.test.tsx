/** @vitest-environment jsdom */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLocaleContext } from "./locale-context";

function BrokenConsumer() {
  useLocaleContext();
  return null;
}

describe("locale-context", () => {
  it("throws when used outside of LocaleProvider", () => {
    expect(() => render(<BrokenConsumer />)).toThrow(
      "useLocaleContext must be used within LocaleProvider",
    );
  });
});
