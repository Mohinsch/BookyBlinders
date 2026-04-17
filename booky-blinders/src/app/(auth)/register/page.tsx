// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-page-container">
      {/* You can add your HeroBrassSeal component here if you want! */}
      <RegisterForm />
    </main>
  );
}