// src/app/page.tsx
import { searchBooks } from "@/services/google-books";

export default async function HomePage() {
  // To test the API connection
  const books = await searchBooks("peaky blinders", 10);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "2rem" }}>Google Books API Test</h1>
      
      {books.length === 0 ? (
        <p>No books found. Check your API service or network connection.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {books.map((book) => (
            <article 
              key={book.id} 
              style={{ border: "1px solid #ccc", padding: "1rem", width: "220px", borderRadius: "8px" }}
            >
              {/* Cover Image */}
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <img 
                  src={book.volumeInfo.imageLinks.thumbnail} 
                  alt={book.volumeInfo.title} 
                  style={{ width: "100%", height: "250px", objectFit: "cover" }}
                />
              ) : (
                <div style={{ height: "250px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  No Cover
                </div>
              )}
              
              {/* Book Metadata */}
              <h3 style={{ fontSize: "1.1rem", margin: "0.5rem 0" }}>
                {book.volumeInfo.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}