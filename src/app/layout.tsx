import type { Metadata } from "next";
import { Gentium_Book_Plus } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const gentiumBookPlus = Gentium_Book_Plus({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BookHollow - A Small Online Library",
  description: "A small online library for book lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gentiumBookPlus.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
