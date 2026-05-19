"use client";

import dynamic from "next/dynamic";

// 🚀 Dynamic import for SearchModal - only loaded when user opens search (not on initial page load)
// Wrapped in a Client Component because `ssr: false` requires Client Component context
const SearchModal = dynamic(
  () =>
    import("@/components/search/SearchModal").then((mod) => ({
      default: mod.SearchModal,
    })),
  { ssr: false }, // CSR only - contains interactive state (search query, results)
);

export function SearchModalWrapper() {
  return <SearchModal />;
}
