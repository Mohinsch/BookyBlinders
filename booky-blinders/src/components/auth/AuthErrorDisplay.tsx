"use client";

import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import styles from "./AuthPage.module.scss";

interface AuthErrorDisplayProps {
  error: {
    id: string;
    message: string;
    type: "error" | "warning";
  };
  onClose: () => void;
}

export function AuthErrorDisplay({ error, onClose }: AuthErrorDisplayProps) {
  const errorVariants = {
    initial: { opacity: 0, x: -30, y: -20 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      x: 30,
      y: -20,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  } as const;

  const iconVariants = {
    initial: { rotate: -180, opacity: 0 },
    animate: {
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] },
    },
  } as const;

  return (
    <motion.div
      key={error.id}
      className={`${styles.errorContainer} ${styles[error.type]}`}
      variants={errorVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <div className={styles.errorContent}>
        <motion.div
          className={styles.errorIcon}
          variants={iconVariants}
          initial="initial"
          animate="animate"
        >
          <AlertCircle size={20} />
        </motion.div>

        <p className={styles.errorMessage}>{error.message}</p>

        <button
          type="button"
          className={styles.errorClose}
          onClick={onClose}
          aria-label="Fermer le message d'erreur"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
