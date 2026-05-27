"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { changePasswordSchema, deleteAccountSchema } from "@/lib/schemas";
import type { ActionResponse } from "@/types/actions";

async function requireAuth() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

/**
 * Change password using Better Auth's password reset flow
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResponse> {
  try {
    const parsed = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input provided",
      };
    }

    const currentUser = await requireAuth();

    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return { success: false, message: "New password must be different" };
    }

    // Call Better Auth's password change endpoint
    const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const headersList = await headers();

    const response = await fetch(`${baseURL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: headersList.get("cookie") || "",
        origin: baseURL,
      },
      body: JSON.stringify({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "Failed to change password",
      };
    }

    console.log(`[Action] Password changed for user ${currentUser.id}`);
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("[Action Error] changePassword:", error);
    const message =
      error instanceof Error ? error.message : "Failed to change password";
    return { success: false, message };
  }
}

/**
 * Delete user account with cascade deletion
 */
export async function deleteAccount(password: string): Promise<ActionResponse> {
  try {
    const parsed = deleteAccountSchema.safeParse({ password });
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input provided",
      };
    }

    const currentUser = await requireAuth();

    // For security, verify password by calling Better Auth
    const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const headersList = await headers();

    const verifyResponse = await fetch(`${baseURL}/api/auth/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: headersList.get("cookie") || "",
        origin: baseURL,
      },
      body: JSON.stringify({
        password: parsed.data.password,
      }),
    });

    if (!verifyResponse.ok) {
      return { success: false, message: "Incorrect password" };
    }

    // Password verified, proceed with account deletion
    // Database cascade will handle all related data:
    // - sessions → deleted (cascade)
    // - accounts → deleted (cascade)
    // - verifications → deleted (cascade)
    // - libraries → deleted (cascade)
    // - library_books → deleted (cascade)
    // - user_categories → deleted (cascade)
    // - reviews → deleted (cascade)

    const deletedUser = await db
      .delete(user)
      .where(eq(user.id, currentUser.id))
      .returning();

    if (deletedUser.length === 0) {
      return { success: false, message: "User not found" };
    }

    console.log(
      `[Action] Account deleted for user ${currentUser.id} - cascade deletion executed`,
    );
    return {
      success: true,
      message:
        "Account and all associated data deleted successfully. You will be logged out shortly.",
    };
  } catch (error) {
    console.error("[Action Error] deleteAccount:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete account";
    return { success: false, message };
  }
}
