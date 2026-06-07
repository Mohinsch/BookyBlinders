import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getOwnedGoogleBookIds, getUserLibraries } from "@/actions/library";
import { authClient } from "@/lib/auth-client";
import type { UserLibrarySummary } from "@/types/library";

export const useLibraryOwnership = (isActive: boolean) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const enabled = isActive && Boolean(session?.user);

  const { data: availableLibraries = [] } = useQuery<UserLibrarySummary[]>({
    queryKey: ["libraries"],
    queryFn: getUserLibraries,
    enabled,
  });

  const { data: ownedGoogleIds = [] } = useQuery<string[]>({
    queryKey: ["ownedGoogleIds"],
    queryFn: getOwnedGoogleBookIds,
    enabled,
  });

  const markOwned = useCallback(
    (googleId: string) => {
      queryClient.setQueryData<string[]>(["ownedGoogleIds"], (prev = []) =>
        prev.includes(googleId) ? prev : [...prev, googleId],
      );
    },
    [queryClient],
  );

  return {
    availableLibraries,
    ownedGoogleIds,
    markOwned,
  };
};
