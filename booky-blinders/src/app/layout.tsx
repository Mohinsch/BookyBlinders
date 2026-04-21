import type { Metadata } from "next";
import { DM_Sans, EB_Garamond, Montserrat } from "next/font/google";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${garamond.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}