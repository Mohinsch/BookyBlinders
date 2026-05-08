// src/components/auth/LoginForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import styles from "./AuthPage.module.scss";

// 1. Zod Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
  onError?: (message: string) => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onError, onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 2. Init TanStack Form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);

      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        const errorMsg =
          error.message || "Invalid credentials. Please try again.";
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
        <h2>Welcome</h2>
        <p>Return to your private collection.</p>
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

      {/* EMAIL FIELD - Native Zod Validation */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const res = loginSchema.shape.email.safeParse(value);
            return res.success ? undefined : res.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className={styles.inputGroup}>
            <label htmlFor={field.name}>Email Address</label>
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

      {/* PASSWORD FIELD - Native Zod Validation */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const res = loginSchema.shape.password.safeParse(value);
            return res.success ? undefined : res.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className={styles.inputGroup}>
            <label htmlFor={field.name}>Password</label>
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
            {isSubmitting ? "Verifying..." : "Sign In"}
          </motion.button>
        )}
      </form.Subscribe>

      {/* SWITCH TO REGISTER */}
      {onSwitchToRegister && (
        <div className={styles.authFooter}>
          <p>
            Don't have an account yet?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={styles.switchLink}
            >
              Sign up here
            </button>
          </p>
        </div>
      )}
    </form>
  );
}
