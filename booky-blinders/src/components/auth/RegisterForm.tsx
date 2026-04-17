// src/components/auth/RegisterForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";

// 1. Zod Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function RegisterForm() {
  const router = useRouter();
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
        setGlobalError(error.message || "An unexpected error occurred. Please try again.");
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
      className="auth-form"
    >
      <div className="form-header">
        <h2>Join the Clan</h2>
        <p>Sign up to organize your books.</p>
      </div>

      {globalError && <div className="error-alert">{globalError}</div>}

      {/* NAME FIELD */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const res = registerSchema.shape.name.safeParse(value);
            // ✅ Utilisation de .issues au lieu de .errors
            return res.success ? undefined : res.error.issues[0].message; 
          }
        }}
        children={(field) => (
          <div className="input-group">
            <label htmlFor={field.name}>Name</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Thomas Shelby"
            />
            {field.state.meta.errors.length > 0 ? (
              <em className="field-error">{field.state.meta.errors.join(", ")}</em>
            ) : null}
          </div>
        )}
      />

      {/* EMAIL FIELD */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const res = registerSchema.shape.email.safeParse(value);
            // ✅ Utilisation de .issues au lieu de .errors
            return res.success ? undefined : res.error.issues[0].message;
          }
        }}
        children={(field) => (
          <div className="input-group">
            <label htmlFor={field.name}>Email Address</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="thomas@shelbycompany.com"
            />
            {field.state.meta.errors.length > 0 ? (
              <em className="field-error">{field.state.meta.errors.join(", ")}</em>
            ) : null}
          </div>
        )}
      />

      {/* PASSWORD FIELD */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const res = registerSchema.shape.password.safeParse(value);
            // ✅ Utilisation de .issues au lieu de .errors
            return res.success ? undefined : res.error.issues[0].message;
          }
        }}
        children={(field) => (
          <div className="input-group">
            <label htmlFor={field.name}>Password</label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
            />
            {field.state.meta.errors.length > 0 ? (
              <em className="field-error">{field.state.meta.errors.join(", ")}</em>
            ) : null}
          </div>
        )}
      />

      {/* SUBMIT BUTTON */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "Enlisting..." : "Sign Up"}
          </button>
        )}
      />

      <div className="auth-footer" style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>Already a member? <Link href="/login" style={{ color: "#b87333" }}>Sign in here</Link></p>
      </div>
    </form>
  );
}