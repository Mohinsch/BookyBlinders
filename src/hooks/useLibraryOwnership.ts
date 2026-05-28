import { useCallback, useEffect, useState } from "react";
import { getOwnedGoogleBookIds, getUserLibraries } from "@/actions/library";
import { authClient } from "@/lib/auth-client";
import type { UserLibrarySummary } from "@/types/library";

export const useLibraryOwnership = (isActive: boolean) => {
  const { data: session } = authClient.useSession();
  const [availableLibraries, setAvailableLibraries] = useState<
    UserLibrarySummary[]
  >([]);
  const [ownedGoogleIds, setOwnedGoogleIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive || !session?.user) return;

    const loadLibraries = async () => {
      const libraries = await getUserLibraries();
      const ownedIds = await getOwnedGoogleBookIds();
      setAvailableLibraries(libraries);
      setOwnedGoogleIds(ownedIds);
    };

    void loadLibraries();
  }, [isActive, session?.user?.id, session?.user]);

  const markOwned = useCallback((googleId: string) => {
    setOwnedGoogleIds((prev) =>
      prev.includes(googleId) ? prev : [...prev, googleId],
    );
  }, []);

  return {
    availableLibraries,
    ownedGoogleIds,
    setOwnedGoogleIds,
    markOwned,
  };
};
