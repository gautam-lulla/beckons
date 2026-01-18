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

    return data?.contentEntryBySlug?.data as T;
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
