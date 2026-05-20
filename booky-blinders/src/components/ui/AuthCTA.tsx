/**
 * AuthCTA - Call-to-Action button with authentication-aware routing
 * Redirects to /login if not authenticated, /library if authenticated
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { Button } from "./Button";

interface AuthCTAProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  authenticatedHref?: string;
  unauthenticatedHref?: string;
  className?: string;
}

export function AuthCTA({
  children,
  variant = "primary",
  authenticatedHref = ROUTES.LIBRARY,
  unauthenticatedHref = ROUTES.LOGIN,
  className = "",
}: AuthCTAProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    const href = session?.user ? authenticatedHref : unauthenticatedHref;
    router.push(href);
  };

  // Don't render interactive state until mounted to prevent hydration mismatch
  const isLoading = isMounted ? isPending : false;

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
