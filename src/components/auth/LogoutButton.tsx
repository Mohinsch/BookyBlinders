// src/components/auth/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // After sign out, redirect to login
          router.push("/login");
        },
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="logout-btn"
      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
    >
      Sign Out
    </button>
  );
}
