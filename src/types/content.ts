// CMS Content Types

export interface Lodge {
  name: string;
  location: string;
}

export interface CountryLodges {
  country: string;
  lodges: Lodge[];
}

export interface FooterContent {
  logoUrl: string;
  logoAlt?: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  portfolioTitle: string;
  portfolioDescription: string;
  lodges: CountryLodges[];
  copyrightText: string;
}

export interface SiteSettings {
  logoUrl: string;
  logoAlt: string;
  logoIconUrl: string;
  brandName: string;
}

// Page Content Types
export interface HeroContent {
  logoUrl: string;
  logoAlt: string;
}

export interface IntroContent {
  headline: string;
  ctaText: string;
  ctaUrl: string;
}

export interface AboutContent {
  title: string;
  titleItalicPart?: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
}

export interface LodgeCarouselItem {
  name: string;
  region: string;
  country: string;
  imageUrl: string;
  iconUrl?: string;
}

export interface LodgeCarouselContent {
  title: string;
  lodges: LodgeCarouselItem[];
}

export interface WhyBeckonsCard {
  title: string;
  description: string;
  imageUrl: string;
  iconUrl?: string;
}

export interface WhyBeckonsContent {
  title: string;
  description: string;
  cards: WhyBeckonsCard[];
}

export interface HomePageContent {
  hero: HeroContent;
  intro: IntroContent;
  about: AboutContent;
  lodgeCarousel: LodgeCarouselContent;
  whyBeckons: WhyBeckonsContent;
  stickyButtonText: string;
  metaTitle: string;
  metaDescription: string;
}

export interface FormField {
  label: string;
  placeholder?: string;
  required?: boolean;
  type: "text" | "email" | "tel" | "select" | "textarea" | "checkbox";
  options?: { value: string; label: string }[];
}

export interface FormPageContent {
  title: string;
  titleItalicPart?: string;
  subtitle: string;
  fields: Record<string, FormField>;
  submitButtonText: string;
  privacyText: string;
  privacyLinkText: string;
  privacyLinkUrl: string;
  subscribeCheckboxText?: string;
  interests?: { value: string; label: string }[];
  metaTitle: string;
  metaDescription: string;
}

export interface ThankYouPageContent {
  title: string;
  message: string;
  backgroundImageUrl: string;
  metaTitle: string;
  metaDescription: string;
}
