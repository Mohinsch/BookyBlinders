/**
 * Example: Consuming Server Actions with Validation Errors
 *
 * This file demonstrates how to use the validated Server Actions
 * and handle the validation errors returned.
 */

"use client";

import {
  createLibrary,
  renameLibrary,
  updateReadingStatus,
} from "@/actions/library";
import {
  errorsToFieldMap,
  formatErrors,
  getFieldError,
} from "@/lib/validation";

/**
 * Example 1: Simple error handling with message display
 */
export async function handleCreateLibrary(name: string) {
  const result = await createLibrary(name);

  if (!result.success) {
    // Option 1: Display all errors as a string
    if (result.errors) {
      const errorMessage = formatErrors(result.errors);
      console.error("Validation failed:", errorMessage);
      // Display to user: "name: Library name is required; name: Library name must be less than 100 characters"
    }

    // Option 2: Display generic message
    if (result.message) {
      console.error("Error:", result.message);
    }
  } else {
    console.log("Library created successfully!");
  }
}

/**
 * Example 2: Field-level error handling (useful for forms)
 */
export async function handleRenameLibraryWithFieldErrors(
  libraryId: number,
  name: string,
) {
  const result = await renameLibrary(libraryId, name);

  if (!result.success && result.errors) {
    // Convert errors to a field map for easy form rendering
    const fieldErrors = errorsToFieldMap(result.errors);

    // Now you can bind errors to specific form fields
    console.log("Field errors:", fieldErrors);
    // Output: { "libraryId": "Invalid library ID", "name": "Library name is required" }

    // Get error for a specific field
    const nameError = getFieldError(result.errors, "name");
    if (nameError) {
      console.error("Name field error:", nameError);
      // You can update the form state with this error
    }
  } else {
    console.log("Library renamed successfully!");
  }
}

/**
 * Example 3: Using with TanStack Form (as in the codebase)
 */
export function createLibraryFormHandler() {
  return async (values: { name: string }) => {
    const result = await createLibrary(values.name);

    if (!result.success) {
      if (result.errors) {
        // Return field errors to TanStack Form
        return {
          fieldErrors: errorsToFieldMap(result.errors),
        };
      }
      if (result.message) {
        // Return global error
        return {
          globalError: result.message,
        };
      }
    }

    return { success: true };
  };
}

/**
 * Example 4: Handling optional parameter validation
 */
export async function handleUpdateReadingStatus(
  bookId: number,
  status: string,
  libraryId?: number,
) {
  // NOTE: This will fail validation because "status" is not one of the allowed values
  // The server will return: { success: false, errors: [{ field: "status", message: "Invalid reading status" }] }
  const result = await updateReadingStatus(
    bookId,
    status as "UNREAD" | "IN_PROGRESS" | "READ",
    libraryId,
  );

  if (!result.success && result.errors) {
    // Find validation errors
    const statusError = getFieldError(result.errors, "status");
    if (statusError) {
      console.error("Invalid status:", statusError);
      // Show to user which statuses are valid
    }
  }
}

/**
 * Error Response Structure
 *
 * Success response:
 * {
 *   success: true,
 *   message?: "Library created"
 * }
 *
 * Validation error response:
 * {
 *   success: false,
 *   errors: [
 *     { field: "name", message: "Library name is required" },
 *     { field: "libraryId", message: "Invalid library ID" }
 *   ]
 * }
 *
 * Server error response:
 * {
 *   success: false,
 *   message: "Failed to create library"
 * }
 */

/**
 * Best Practices
 *
 * 1. Always check result.success first
 * 2. Use errorsToFieldMap() for form rendering
 * 3. Use getFieldError() to get individual field errors
 * 4. Use formatErrors() to display all errors as a string
 * 5. Fall back to result.message for server errors
 * 6. Show validation errors inline on form fields when possible
 * 7. Don't duplicate validation on client - trust server validation
 */
