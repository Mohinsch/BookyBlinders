"use client";

import { AnimatePresence, motion } from "framer-motion";
import styles from "./AuthPage.module.scss";

interface AuthFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  placeholder: string;
  errorMessages: string[];
  onBlur: () => void;
  onChange: (value: string) => void;
}

export function AuthField({
  id,
  label,
  type,
  value,
  placeholder,
  errorMessages,
  onBlur,
  onChange,
}: AuthFieldProps) {
  const hasErrors = errorMessages.length > 0;

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={hasErrors ? styles.inputError : ""}
      />
      <AnimatePresence mode="wait">
        {hasErrors ? (
          <motion.p
            className={styles.fieldError}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {errorMessages.join(", ")}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
