import { AuthPage } from "@/components/auth/AuthPage";

interface LoginPageProps {
  searchParams?: Promise<{
    mode?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialMode = params?.mode === "register" ? "register" : "login";

  return (
    <main>
      <AuthPage initialMode={initialMode} />
    </main>
  );
}
