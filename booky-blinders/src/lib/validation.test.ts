import { describe, expect, it } from "vitest";
import { type ZodSchema, z } from "zod";
import {
  errorsToFieldMap,
  formatErrors,
  getFieldError,
  validateWithZod,
} from "./validation";

describe("validation helpers", () => {
  it("returns structured errors for invalid input", () => {
    const schema = z.object({
      name: z.string().min(2, "Name too short"),
    });

    const result = validateWithZod<{ name: string }>(schema, { name: "A" });

    expect(result.success).toBe(false);
    expect(result.errors).toEqual([
      { field: "name", message: "Name too short" },
    ]);
  });

  it("returns data for valid input", () => {
    const schema = z.object({
      email: z.string().email(),
    });

    const result = validateWithZod<{ email: string }>(schema, {
      email: "test@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ email: "test@example.com" });
  });

  it("maps and formats validation errors", () => {
    const errors = [
      { field: "email", message: "Email is required" },
      { field: "password", message: "Password is required" },
    ];

    const fieldMap = errorsToFieldMap(errors);
    const emailError = getFieldError(errors, "email");
    const formatted = formatErrors(errors);

    expect(fieldMap).toEqual({
      email: "Email is required",
      password: "Password is required",
    });
    expect(emailError).toBe("Email is required");
    expect(formatted).toBe(
      "email: Email is required; password: Password is required",
    );
  });

  it("falls back to a default message when no errors exist", () => {
    expect(formatErrors(undefined)).toBe("Validation failed");
    expect(formatErrors([])).toBe("Validation failed");
  });

  it("returns a global error when schema parsing throws", () => {
    const badSchema = {
      safeParse: () => {
        throw new Error("Boom");
      },
    } as unknown as ZodSchema;

    const result = validateWithZod(badSchema, {});

    expect(result).toEqual({
      success: false,
      globalError: "An unexpected validation error occurred",
    });
  });
});
