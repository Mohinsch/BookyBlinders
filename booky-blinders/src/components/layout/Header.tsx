// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  // hook from Better-Auth
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh(); // Ensure the server-side state is updated
        },
      },
    });
  };

  return (
    <header className="main-header">
      <nav className="header-nav">
        {/* LOGO - Accessible to everyone */}
        <div className="logo">
          <Link href="/">
            <span className="logo-text">BB</span>
            <span className="logo-subtext">Booky Blinders</span>
          </Link>
        </div>

        <div className="nav-links">
          {/* While the session is loading, we can show a placeholder or nothing */}
          {!isPending && (
            <>
              {session ? (
                /* AUTHENTICATED STATE */
                <>
                  <Link href="/library" className="nav-item">My Library</Link>
                  <Link href="/profile" className="nav-item">Profile</Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Sign Out
                  </button>
                </>
              ) : (
                /* GUEST STATE */
                <>
                  <Link href="/login" className="nav-item">Sign In</Link>
                  <Link href="/register" className="nav-item btn-copper">
                    Enlist
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}