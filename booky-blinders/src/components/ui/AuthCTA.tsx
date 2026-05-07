/**
 * AuthCTA - Call-to-Action button with authentication-aware routing
 * Redirects to /login if not authenticated, /library if authenticated
 */

"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./Button";
import { ROUTES } from "@/constants";

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

  const handleClick = () => {
    const href = session?.user ? authenticatedHref : unauthenticatedHref;
    router.push(href);
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Loading..." : children}
    </Button>
  );
}
