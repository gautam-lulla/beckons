import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beckons",
  description: "A global curator of remarkable journeys of discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <div className="max-w-[1920px] mx-auto relative">{children}</div>
        <script
          src="https://cms.sphereos.dev/editor.js"
          data-cms-url="https://cms.sphereos.dev"
          defer
        />
      </body>
    </html>
  );
}
