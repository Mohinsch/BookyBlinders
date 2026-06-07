import type { ZodSchema } from "zod";

/**
 * Structured validation error type that can be easily consumed by the client
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  globalError?: string;
}

/**
 * Validates data against a Zod schema and returns a structured result
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns ValidationResult with either data or structured errors
 */
export function validateWithZod<T>(
  schema: ZodSchema,
  data: unknown,
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: ValidationError[] = result.error.issues.map((error) => ({
        field: error.path.join(".") || "root",
        message: error.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: result.data as T,
    };
  } catch (_error) {
    return {
      success: false,
      globalError: "An unexpected validation error occurred",
    };
  }
}

/**
 * Converts validation errors to a map for easy field-level access
 * @param errors - Array of ValidationError objects
 * @returns Object with field names as keys and error messages as values
 */
export function errorsToFieldMap(
  errors: ValidationError[] | undefined,
): Record<string, string> {
  if (!errors) return {};

  return errors.reduce(
    (acc, error) => {
      acc[error.field] = error.message;
      return acc;
    },
    {} as Record<string, string>,
  );
}

/**
 * Gets the first error message for a specific field
 * @param errors - Array of ValidationError objects
 * @param field - Field name to search for
 * @returns Error message or undefined
 */
export function getFieldError(
  errors: ValidationError[] | undefined,
  field: string,
): string | undefined {
  return errors?.find((e) => e.field === field)?.message;
}

/**
 * Formats all errors into a human-readable string
 * @param errors - Array of ValidationError objects
 * @returns Comma-separated error messages
 */
export function formatErrors(errors: ValidationError[] | undefined): string {
  if (!errors || errors.length === 0) return "Validation failed";
  return errors.map((e) => `${e.field}: ${e.message}`).join("; ");
}
