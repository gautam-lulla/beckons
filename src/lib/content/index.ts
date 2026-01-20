import { apolloClient } from "../apollo-client";
import { GET_CONTENT_ENTRY_BY_SLUG, GET_CONTENT_TYPE_BY_SLUG } from "../queries";

const ORGANIZATION_ID = process.env.CMS_ORGANIZATION_ID;

// GraphQL response types
interface ContentTypeResponse {
  contentTypeBySlug: {
    id: string;
  } | null;
}

interface ContentEntryResponse {
  contentEntryBySlug: {
    data: unknown;
  } | null;
}

// Transform flat CMS data to nested structure expected by components
// This allows the CMS to use individual fields while keeping the frontend component API stable
interface FlatHomeData {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroLogoUrl?: string;
  heroLogoAlt?: string;
  heroVideoUrl?: string;
  heroPosterUrl?: string;
  introHeadline?: string;
  introCtaText?: string;
  introCtaUrl?: string;
  aboutTitle?: string;
  aboutTitleItalicPart?: string;
  aboutBody?: string;
  aboutCtaText?: string;
  aboutCtaUrl?: string;
  videoMaskImageUrl?: string;
  whyBeckonsTitle?: string;
  whyBeckonsDescription?: string;
  whyBeckonsCards?: unknown[];
  lodgeCarouselTitle?: string;
  lodgeCarouselLodges?: unknown[];
  stickyButtonText?: string;
}

function transformHomePageData(flat: FlatHomeData): unknown {
  return {
    title: flat.title,
    metaTitle: flat.metaTitle,
    metaDescription: flat.metaDescription,
    hero: {
      logoUrl: flat.heroLogoUrl,
      logoAlt: flat.heroLogoAlt,
      videoUrl: flat.heroVideoUrl,
      posterUrl: flat.heroPosterUrl,
    },
    intro: {
      headline: flat.introHeadline,
      ctaText: flat.introCtaText,
      ctaUrl: flat.introCtaUrl,
    },
    videoMask: {
      imageUrl: flat.videoMaskImageUrl,
    },
    about: {
      title: flat.aboutTitle,
      titleItalicPart: flat.aboutTitleItalicPart,
      body: flat.aboutBody,
      ctaText: flat.aboutCtaText,
      ctaUrl: flat.aboutCtaUrl,
    },
    whyBeckons: {
      title: flat.whyBeckonsTitle,
      description: flat.whyBeckonsDescription,
      cards: flat.whyBeckonsCards,
    },
    lodgeCarousel: {
      title: flat.lodgeCarouselTitle,
      lodges: flat.lodgeCarouselLodges,
    },
    stickyButtonText: flat.stickyButtonText,
  };
}

// Check if data appears to be flat CMS format (has heroLogoUrl instead of hero.logoUrl)
function isFlatFormat(data: unknown): data is FlatHomeData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return 'heroLogoUrl' in d || 'introHeadline' in d || 'aboutTitle' in d;
}

// Cache for content type IDs
const contentTypeIdCache: Record<string, string> = {};

async function getContentTypeId(slug: string): Promise<string> {
  if (contentTypeIdCache[slug]) {
    return contentTypeIdCache[slug];
  }

  const { data } = await apolloClient.query<ContentTypeResponse>({
    query: GET_CONTENT_TYPE_BY_SLUG,
    variables: {
      slug,
      organizationId: ORGANIZATION_ID,
    },
  });

  if (!data?.contentTypeBySlug?.id) {
    throw new Error(`Content type not found: ${slug}`);
  }

  contentTypeIdCache[slug] = data.contentTypeBySlug.id;
  return data.contentTypeBySlug.id;
}

export async function getContentEntry<T>(
  contentTypeSlug: string,
  entrySlug: string
): Promise<T | null> {
  try {
    const contentTypeId = await getContentTypeId(contentTypeSlug);

    const { data } = await apolloClient.query<ContentEntryResponse>({
      query: GET_CONTENT_ENTRY_BY_SLUG,
      variables: {
        slug: entrySlug,
        contentTypeId,
        organizationId: ORGANIZATION_ID,
      },
      fetchPolicy: "network-only", // Force fresh fetch
    });

    const rawData = data?.contentEntryBySlug?.data;

    // Transform flat CMS data to nested format for homepage
    // This allows the CMS to use individual fields while keeping the component API stable
    if (contentTypeSlug === "page-content" && entrySlug === "home" && isFlatFormat(rawData)) {
      return transformHomePageData(rawData) as T;
    }

    return rawData as T;
  } catch (error) {
    console.error(`Failed to fetch content entry: ${contentTypeSlug}/${entrySlug}`, error);
    return null;
  }
}

// Convenience functions for common content types
export async function getPageContent<T>(pageSlug: string): Promise<T | null> {
  return getContentEntry<T>("page", pageSlug);
}

export async function getSiteSettings<T>(): Promise<T | null> {
  return getContentEntry<T>("site-settings", "global-settings");
}

export async function getNavigation<T>(): Promise<T | null> {
  return getContentEntry<T>("navigation", "global-navigation");
}

export async function getFooterContent<T>(): Promise<T | null> {
  return getContentEntry<T>("site-footer", "global-footer");
}
