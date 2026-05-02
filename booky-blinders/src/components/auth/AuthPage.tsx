"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import styles from "./AuthPage.module.scss";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type AuthMode = "login" | "register";

interface AuthError {
  id: string;
  message: string;
  type: "error" | "warning";
}

interface AuthPageProps {
  initialMode?: AuthMode;
}

export function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [globalError, setGlobalError] = useState<AuthError | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleModeSwitch = (newMode: AuthMode) => {
    if (isAnimating || newMode === mode) return;

    setMode(newMode);
    setIsAnimating(true);
    setGlobalError(null);

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  const handleError = (message: string) => {
    setGlobalError({
      id: `error-${Date.now()}`,
      message,
      type: "error",
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setGlobalError(null);
    }, 5000);
  };

  const handleClearError = () => {
    setGlobalError(null);
  };

  return (
    <div className={styles.authPageWrapper}>
      <div
        className={`${styles.authContainer} ${mode === "login" ? styles.modeLogin : styles.modeRegister}`}
      >
        <div className={styles.mobileIntro}>
          <h1>The Club Entrance</h1>
          <p>Choose your side. One door, two paths.</p>
        </div>

        <div className={styles.panelStage}>
          <motion.section
            className={`${styles.formPanel} ${styles.panelLogin}`}
            animate={
              mode === "login"
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0.5, scale: 0.98, y: 6 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
            aria-hidden={mode !== "login"}
          >
            <LoginForm
              onError={handleError}
              onSwitchToRegister={() => handleModeSwitch("register")}
            />
          </motion.section>

          <motion.section
            className={`${styles.formPanel} ${styles.panelRegister}`}
            animate={
              mode === "register"
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0.5, scale: 0.98, y: 6 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
            aria-hidden={mode !== "register"}
          >
            <RegisterForm
              onError={handleError}
              onSwitchToLogin={() => handleModeSwitch("login")}
            />
          </motion.section>

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
                    <h2>Welcome to the Club</h2>
                    <p>
                      New to the family? Create your account to open
                      your private registry.
                    </p>
                    <button
                      type="button"
                      className={styles.overlayButton}
                      onClick={() => handleModeSwitch("register")}
                      disabled={isAnimating}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    <h2>Welcome Back</h2>
                    <p>
                      Already a member? Return to your collection and resume
                      your reading.
                    </p>
                    <button
                      type="button"
                      className={styles.overlayButton}
                      onClick={() => handleModeSwitch("login")}
                      disabled={isAnimating}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </div>
      </div>

      <AnimatePresence>
        {globalError && (
          <AuthErrorDisplay error={globalError} onClose={handleClearError} />
        )}
      </AnimatePresence>
    </div>
  );
}