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
    return null;
  }

  return <BookDetailsModal bookDetails={bookDetails} />;
}
