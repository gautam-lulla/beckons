import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { InlineEditorScript } from "@/components/cms/InlineEditorScript";
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
        <Suspense fallback={null}>
          <InlineEditorScript
            orgSlug="beckons"
            apiBase={process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL?.replace('/graphql', '') || "https://backend-production-162b.up.railway.app"}
            adminBase={process.env.NEXT_PUBLIC_CMS_ADMIN_URL || "https://admin-gules-psi-18.vercel.app"}
          />
        </Suspense>
      </body>
    </html>
  );
}
