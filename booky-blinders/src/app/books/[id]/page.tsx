import { BookDetailsModal } from "@/components/modal/BookDetailsModal";
import { getBookDetailsByRouteId } from "@/lib/book-details";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const bookDetails = await getBookDetailsByRouteId(id);

  if (!bookDetails) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
        }}
      >
        Book not found
      </div>
    );
  }

  return <BookDetailsModal bookDetails={bookDetails} />;
}
