"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./AuthPage.module.scss";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type AuthMode = "login" | "register";

interface AuthPageProps {
  initialMode?: AuthMode;
}

export function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleModeSwitch = (newMode: AuthMode) => {
    if (isAnimating || newMode === mode) return;

    setMode(newMode);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  return (
    <div className={styles.authPageWrapper}>
      <div
        className={`${styles.authContainer} ${mode === "login" ? styles.modeLogin : styles.modeRegister}`}
      >
        <div className={styles.mobileIntro}>
          <h1>{t("auth.clubEntrance")}</h1>
          <p>{t("auth.chooseYourSide")}</p>
        </div>

        <div className={styles.panelStage}>
          <section
            className={`${styles.formPanel} ${styles.panelLogin}`}
            aria-hidden={mode !== "login"}
          >
            {/* Suppression de la prop onError ici */}
            <LoginForm
              onSwitchToRegister={() => handleModeSwitch("register")}
            />
          </section>

          <section
            className={`${styles.formPanel} ${styles.panelRegister}`}
            aria-hidden={mode !== "register"}
          >
            {/* Suppression de la prop onError ici */}
            <RegisterForm onSwitchToLogin={() => handleModeSwitch("login")} />
          </section>

          <motion.aside
            className={styles.overlayPanel}
            initial={false}
            animate={
              mode === "login"
                ? {
                    x: "0%",
                    clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)",
                  }
                : {
                    x: "-100%",
                    clipPath: "polygon(0 0, 88% 0, 100% 100%, 12% 100%)",
                  }
            }
            transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                className={styles.overlayContent}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {mode === "login" ? (
                  <>
                    <h2>{t("auth.welcomeToClub")}</h2>
                    <p>
                      {t("auth.newToFamily")}
                    </p>
                    <button
                      type="button"
                      className={styles.overlayButton}
                      onClick={() => handleModeSwitch("register")}
                      disabled={isAnimating}
                    >
                      {t("auth.signUp")}
                    </button>
                  </>
                ) : (
                  <>
                    <h2>{t("auth.welcomeBack")}</h2>
                    <p>
                      {t("auth.alreadyMember")}
                    </p>
                    <button
                      type="button"
                      className={styles.overlayButton}
                      onClick={() => handleModeSwitch("login")}
                      disabled={isAnimating}
                    >
                      {t("auth.signIn")}
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
