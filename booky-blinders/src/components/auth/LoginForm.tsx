// src/components/auth/LoginForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod"; 
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";

// 1. Zod Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 2. Initialize TanStack Form (Sans adapter)
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
        setGlobalError(error.message || "Invalid credentials. By order of the Peaky Blinders, try again.");
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
        <h2>Welcome Back</h2>
        <p>Return to your private collection.</p>
      </div>

      {globalError && <div className="error-alert">{globalError}</div>}

      {/* EMAIL FIELD - Validation Zod Native */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const res = loginSchema.shape.email.safeParse(value);
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

      {/* PASSWORD FIELD - Validation Zod Native */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const res = loginSchema.shape.password.safeParse(value);
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
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        )}
      />

      <div className="auth-footer" style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>Not part of the clan yet? <Link href="/register" style={{ color: "#b87333" }}>Enlist here</Link></p>
      </div>
    </form>
  );
}