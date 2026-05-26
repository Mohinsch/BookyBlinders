/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and merges custom className", () => {
    render(
      <Button className="custom-class" variant="outline">
        Click me
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button.className).toContain("custom-class");
  });

  it("passes through props like onClick", () => {
    const handleClick = vi.fn();

    render(
      <Button type="button" onClick={handleClick}>
        Press
      </Button>,
    );

    screen.getByRole("button", { name: "Press" }).click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
