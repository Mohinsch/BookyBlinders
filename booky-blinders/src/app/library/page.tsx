// Force dynamic rendering: This page relies on request-specific data (headers/cookies for auth) 
// and cannot be statically generated at build time.
export const dynamic = "force-dynamic";
import { getUserLibraries, getUserLibrary } from "@/actions/library";
import { LibraryDashboard } from "@/components/library/LibraryDashboard";

export default async function LibraryPage() {
  const libraries = await getUserLibraries();
  const initialLibraryId = libraries[0]?.id;
  const initialBooks = initialLibraryId
    ? await getUserLibrary(initialLibraryId)
    : [];

  return (
    <main
      style={{
        padding: "3rem 1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-garamond)",
          fontSize: "3rem",
          color: "var(--color-primary)",
          marginBottom: "2rem",
        }}
      >
        The Ledger
      </h1>
      <LibraryDashboard initialBooks={initialBooks} libraries={libraries} />
    </main>
  );
}
