"use client";

import { useState } from "react";
import { changePassword } from "@/actions/account";
import styles from "./ChangePasswordForm.module.scss";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Client-side validation
    if (!formData.currentPassword.trim()) {
      setMessage({ type: "error", text: "Current password is required" });
      setIsLoading(false);
      return;
    }

    if (!formData.newPassword.trim()) {
      setMessage({ type: "error", text: "New password is required" });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    const result = await changePassword(
      formData.currentPassword,
      formData.newPassword,
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Password changed successfully",
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage({
        type: "error",
        text: result.message || "Failed to change password",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <h3>Change Password</h3>
      <p className={styles.description}>
        Update your password to keep your account secure
      </p>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter a new password (min 8 characters)"
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
