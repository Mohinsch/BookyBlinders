import { AuthPage } from "@/components/auth/AuthPage";

interface LoginPageProps {
  searchParams?: {
    mode?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const initialMode = searchParams?.mode === "register" ? "register" : "login";

  return (
    <main>
      <AuthPage initialMode={initialMode} />
    </main>
  );
}
