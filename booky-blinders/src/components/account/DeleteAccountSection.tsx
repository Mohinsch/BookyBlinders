"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAccount } from "@/actions/account";
import styles from "./DeleteAccountSection.module.scss";

export function DeleteAccountSection() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDeleting(true);
    setMessage(null);

    if (!password.trim()) {
      setMessage({ type: "error", text: "Password is required" });
      setIsDeleting(false);
      return;
    }

    const result = await deleteAccount(password);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Account deleted",
      });
      setPassword("");
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.message || "Failed to delete account",
      });
      setIsDeleting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <div className={styles.dangerZone}>
          <h3>Delete Account</h3>
          <p className={styles.warning}>
            ⚠️ This action is permanent and cannot be undone. All your data
            including libraries, books, and reviews will be permanently deleted.
          </p>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleDelete} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="deletePassword">
                Enter your password to confirm
              </label>
              <input
                id="deletePassword"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage(null);
                }}
                placeholder="Enter your password"
                disabled={isDeleting}
                required
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmation(false);
                  setPassword("");
                  setMessage(null);
                }}
                disabled={isDeleting}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting}
                className={styles.deleteButton}
              >
                {isDeleting ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.dangerZone}>
        <h3>Danger Zone</h3>
        <p className={styles.description}>
          Permanently delete your account and all associated data
        </p>

        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className={styles.triggerButton}
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
