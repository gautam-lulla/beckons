import { getContentEntry, getFooterContent } from "@/lib/content";
import { ThankYouHero, StickyInquireButton } from "@/components/blocks";
import { Footer } from "@/components/layout";
import type { FooterContent } from "@/types/content";

export const dynamic = "force-dynamic";

interface ThankYouPageData {
  title: string;
  message: string;
  backgroundImageUrl: string;
}

interface PageEntry {
  title: string;
  data: ThankYouPageData;
  metaTitle: string;
  metaDescription: string;
}

export default async function ThankYouPage() {
  const [pageEntry, footerContent] = await Promise.all([
    getContentEntry<PageEntry>("page-content", "thank-you"),
    getFooterContent<FooterContent>(),
  ]);

  if (!pageEntry) {
    return <div>Loading...</div>;
  }

  const { data } = pageEntry;
  const entry = "thank-you";

  return (
    <main className="min-h-screen">
      <StickyInquireButton entry={entry} buttonText="BACK TO HOME" href="/" variant="secondary" />

      <ThankYouHero
        entry={entry}
        title={data.title}
        message={data.message}
        backgroundImageUrl={data.backgroundImageUrl}
      />

      {footerContent && <Footer content={footerContent} variant="burgundy" />}
    </main>
  );
}
