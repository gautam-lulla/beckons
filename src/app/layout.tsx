import type { Metadata } from "next";
import { Suspense } from "react";
import { InlineEditorScript } from "@/components/cms/InlineEditorScript";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beckons",
    template: "%s | Beckons",
  },
  description: "A global curator of remarkable journeys of discovery",
  metadataBase: new URL("https://beckons.com"),
  openGraph: {
    title: "Beckons",
    description: "A global curator of remarkable journeys of discovery",
    url: "https://beckons.com",
    siteName: "Beckons",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beckons",
    description: "A global curator of remarkable journeys of discovery",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="max-w-[1920px] mx-auto relative">{children}</div>
        <Suspense fallback={null}>
          <InlineEditorScript
            orgSlug="beckons"
            apiBase="https://backend-production-162b.up.railway.app"
            adminBase="https://sphereos.vercel.app"
          />
        </Suspense>
      </body>
    </html>
  );
}
