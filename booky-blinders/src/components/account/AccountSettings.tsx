"use client";

import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { DeleteAccountSection } from "@/components/account/DeleteAccountSection";
import { useSession } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./AccountSettings.module.scss";

export function AccountSettings() {
  const { data: session, isPending } = useSession();
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  if (isPending) {
    return <div className={styles.loading}>{t("common.loading")}</div>;
  }

  if (!session?.user) {
    return (
      <div className={styles.loading}>
        {t("accountSettings.pleaseLogIn")}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t("accountSettings.title")}</h1>
        <p>{t("accountSettings.profileDescription")}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>{t("accountSettings.accountInfo")}</h2>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.label}>{t("accountSettings.email")}:</span>
              <span className={styles.value}>{session.user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>{t("accountSettings.name")}:</span>
              <span className={styles.value}>{session.user.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>{t("accountSettings.emailVerified")}:</span>
              <span className={styles.value}>
                {session.user.emailVerified ? t("accountSettings.yes") : t("accountSettings.no")}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <ChangePasswordForm />
        </section>

        <section className={styles.section}>
          <DeleteAccountSection />
        </section>
      </div>
    </div>
  );
}
