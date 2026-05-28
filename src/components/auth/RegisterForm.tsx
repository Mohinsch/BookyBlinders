// src/components/auth/RegisterForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import { registerSchema } from "@/lib/schemas";
import { AuthField } from "./AuthField";
import styles from "./AuthPage.module.scss";

interface RegisterFormProps {
  onError?: (message: string) => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onError, onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
  const [globalError, setGlobalError] = useState<string | null>(null);

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

      router.push(ROUTES.LIBRARY);
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
          <AuthField
            id={field.name}
            label={t("auth.name")}
            type="text"
            value={field.state.value}
            placeholder="Thomas Shelby"
            errorMessages={(field.state.meta.errors as string[]) || []}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
          />
        )}
      </form.Field>

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
          <AuthField
            id={field.name}
            label={t("auth.emailAddress")}
            type="email"
            value={field.state.value}
            placeholder="thomas@shelbycompany.com"
            errorMessages={(field.state.meta.errors as string[]) || []}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
          />
        )}
      </form.Field>

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
          <AuthField
            id={field.name}
            label={t("auth.password")}
            type="password"
            value={field.state.value}
            placeholder="••••••••"
            errorMessages={(field.state.meta.errors as string[]) || []}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
          />
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
