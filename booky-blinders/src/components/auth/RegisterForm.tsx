// src/components/auth/RegisterForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./AuthPage.module.scss";

// 1. Zod Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface RegisterFormProps {
  onError?: (message: string) => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onError, onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 2. Init TanStack Form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);

      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (error) {
        const errorMsg = error.message || t("auth.errorDuringRegistration");
        setGlobalError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      router.push("/library");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={styles.authForm}
    >
      <div className={styles.formHeader}>
        <h2>{t("auth.joinClub")}</h2>
        <p>{t("auth.organizeBookCollection")}</p>
      </div>

      <AnimatePresence>
        {globalError && (
          <motion.div
            className={styles.inlineError}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAME FIELD */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const res = registerSchema.shape.name.safeParse(value);
            return res.success ? undefined : res.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className={styles.inputGroup}>
            <label htmlFor={field.name}>{t("auth.name")}</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Thomas Shelby"
              className={
                field.state.meta.errors.length > 0 ? styles.inputError : ""
              }
            />
            <AnimatePresence mode="wait">
              {field.state.meta.errors.length > 0 ? (
                <motion.p
                  className={styles.fieldError}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {field.state.meta.errors.join(", ")}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </form.Field>

      {/* EMAIL FIELD */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const res = registerSchema.shape.email.safeParse(value);
            return res.success ? undefined : res.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className={styles.inputGroup}>
            <label htmlFor={field.name}>{t("auth.emailAddress")}</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="thomas@shelbycompany.com"
              className={
                field.state.meta.errors.length > 0 ? styles.inputError : ""
              }
            />
            <AnimatePresence mode="wait">
              {field.state.meta.errors.length > 0 ? (
                <motion.p
                  className={styles.fieldError}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {field.state.meta.errors.join(", ")}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </form.Field>

      {/* PASSWORD FIELD */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const res = registerSchema.shape.password.safeParse(value);
            return res.success ? undefined : res.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className={styles.inputGroup}>
            <label htmlFor={field.name}>{t("auth.password")}</label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              className={
                field.state.meta.errors.length > 0 ? styles.inputError : ""
              }
            />
            <AnimatePresence mode="wait">
              {field.state.meta.errors.length > 0 ? (
                <motion.p
                  className={styles.fieldError}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {field.state.meta.errors.join(", ")}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </form.Field>

      {/* SUBMIT BUTTON */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit || isSubmitting}
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
          >
            {isSubmitting ? t("auth.registering") : t("auth.signUp")}
          </motion.button>
        )}
      </form.Subscribe>

      {/* SWITCH TO LOGIN */}
      {onSwitchToLogin && (
        <div className={styles.authFooter}>
          <p>
            {t("auth.alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={styles.switchLink}
            >
              {t("auth.signInHere")}
            </button>
          </p>
        </div>
      )}
    </form>
  );
}
