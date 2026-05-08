"use client";

import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { DeleteAccountSection } from "@/components/account/DeleteAccountSection";
import { useSession } from "@/lib/auth-client";
import styles from "./AccountSettings.module.scss";

export function AccountSettings() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className={styles.loading}>
        Please log in to access account settings
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Account Settings</h1>
        <p>Manage your account information and security preferences</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Account Information</h2>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{session.user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{session.user.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email Verified:</span>
              <span className={styles.value}>
                {session.user.emailVerified ? "Yes" : "No"}
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
