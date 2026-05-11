"use client";

import { useState } from "react";
import { changePassword } from "@/actions/account";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./ChangePasswordForm.module.scss";

export function ChangePasswordForm() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
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
      setMessage({ type: "error", text: t("errors.currentPasswordRequired") });
      setIsLoading(false);
      return;
    }

    if (!formData.newPassword.trim()) {
      setMessage({ type: "error", text: t("errors.newPasswordRequired") });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: t("errors.passwordTooShort"),
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: t("errors.passwordsDontMatch") });
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
        text: result.message || t("accountSettings.savedSuccess"),
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage({
        type: "error",
        text: result.message || t("accountSettings.errorOccurred"),
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <h3>{t("accountSettings.changePassword")}</h3>
      <p className={styles.description}>
        {t("accountSettings.passwordDescription")}
      </p>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">{t("accountSettings.currentPassword")}</label>
          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder={t("accountSettings.currentPassword")}
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">{t("accountSettings.newPassword")}</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder={t("accountSettings.newPassword")}
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">{t("accountSettings.confirmPassword")}</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t("accountSettings.confirmPassword")}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? t("accountSettings.changingPassword") : t("accountSettings.changePassword")}
        </button>
      </form>
    </div>
  );
}
