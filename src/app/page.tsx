import { getContentEntry, getFooterContent } from "@/lib/content";
import {
  HeroSection,
  IntroSection,
  VideoMaskSection,
  AboutSection,
  LodgeCarousel,
  WhyBeckonsSection,
  StickyInquireButton,
} from "@/components/blocks";
import { Footer } from "@/components/layout";
import type { FooterContent } from "@/types/content";

export const dynamic = "force-dynamic";

interface HomePageData {
  hero: {
    logoUrl: string;
    logoAlt: string;
    videoUrl?: string;
    posterUrl?: string;
  };
  intro: {
    headline: string;
    ctaText: string;
    ctaUrl: string;
  };
  videoMask: {
    imageUrl: string;
  };
  about: {
    title: string;
    titleItalicPart?: string;
    body: string;
    ctaText: string;
    ctaUrl: string;
  };
  lodgeCarousel: {
    title: string;
    lodges: Array<{
      name: string;
      region: string;
      country: string;
      imageUrl: string;
      iconUrl?: string;
    }>;
  };
  whyBeckons: {
    title: string;
    description: string;
    cards: Array<{
      title: string;
      description: string;
      imageUrl: string;
    }>;
  };
  stickyButtonText: string;
}

export default async function HomePage() {
  const [data, footerContent] = await Promise.all([
    getContentEntry<HomePageData>("page-content", "home"),
    getFooterContent<FooterContent>(),
  ]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen">
      <StickyInquireButton
        entry="home"
        buttonText={data.stickyButtonText}
        href="/inquire"
      />

      <HeroSection
        entry="home"
        logoUrl={data.hero.logoUrl}
        logoAlt={data.hero.logoAlt}
        videoUrl={data.hero.videoUrl}
        posterUrl={data.hero.posterUrl}
      />

      <IntroSection
        entry="home"
        headline={data.intro.headline}
        ctaText={data.intro.ctaText}
        ctaUrl={data.intro.ctaUrl}
      />

      <VideoMaskSection
        entry="home"
        imageUrl={data.videoMask.imageUrl}
      />

      <AboutSection
        entry="home"
        title={data.about.title}
        titleItalicPart={data.about.titleItalicPart}
        body={data.about.body}
        ctaText={data.about.ctaText}
        ctaUrl={data.about.ctaUrl}
      />

      <LodgeCarousel
        entry="home"
        title={data.lodgeCarousel.title}
        lodges={data.lodgeCarousel.lodges}
      />

      <WhyBeckonsSection
        entry="home"
        title={data.whyBeckons.title}
        description={data.whyBeckons.description}
        cards={data.whyBeckons.cards}
      />

      {footerContent && <Footer content={footerContent} />}
    </main>
  );
}
