// src/components/auth/LogoutButton.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
      onClick={handleLogout} 
      className="logout-btn"
      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
    >
      Sign Out
    </button>
  );
}