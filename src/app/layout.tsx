import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1214" },
  ],
};

// Runs before the first paint so the saved (or system) theme is applied without
// a flash of the wrong colours.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("bookhollow:theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${gentiumBookPlus.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink transition-colors duration-300 motion-reduce:transition-none dark:bg-ink-900 dark:text-cream">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
