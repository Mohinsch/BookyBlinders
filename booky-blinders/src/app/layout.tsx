// src/app/layout.tsx

import type { Metadata } from "next";
import { DM_Sans, EB_Garamond, Montserrat } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchModal } from "@/components/search/SearchModal";
import "@/styles/main.scss"; 

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dm-sans",
});

const garamond = EB_Garamond({ 
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-garamond",
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Booky Blinders | Personal Library",
  description: "By order of the Booky Blinders.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${dmSans.variable} ${garamond.variable} ${montserrat.variable}`}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
        <SearchModal />
        {modal}
      </body>
    </html>
  );
}