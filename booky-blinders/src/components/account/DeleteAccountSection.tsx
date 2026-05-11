"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAccount } from "@/actions/account";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./DeleteAccountSection.module.scss";

export function DeleteAccountSection() {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
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
      setMessage({ type: "error", text: t("errors.passwordRequired") });
      setIsDeleting(false);
      return;
    }

    const result = await deleteAccount(password);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || t("accountSettings.savedSuccess"),
      });
      setPassword("");
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.message || t("accountSettings.errorOccurred"),
      });
      setIsDeleting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <div className={styles.dangerZone}>
          <h3>{t("accountSettings.deleteAccount")}</h3>
          <p className={styles.warning}>
            ⚠️ {t("accountSettings.deleteWarning")}
          </p>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleDelete} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="deletePassword">
                {t("accountSettings.deleteConfirm")}
              </label>
              <input
                id="deletePassword"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage(null);
                }}
                placeholder={t("accountSettings.password")}
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
                {t("accountSettings.cancel")}
              </button>
              <button
                type="submit"
                disabled={isDeleting}
                className={styles.deleteButton}
              >
                {isDeleting ? t("accountSettings.deletingAccount") : t("accountSettings.deleteConfirmButton")}
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
        <h3>{t("accountSettings.dangerZone")}</h3>
        <p className={styles.description}>
          {t("accountSettings.deleteAccountDescription")}
        </p>

        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className={styles.triggerButton}
        >
          {t("accountSettings.deleteAccount")}
        </button>
      </div>
    </div>
  );
}
