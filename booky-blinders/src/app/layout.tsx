// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Booky Blinders",
  description:
    "Personal library management with a 1920s Peaky Blinders aesthetic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />

        {/* Wrapping children in a main tag for SEO and CSS layout management */}
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}