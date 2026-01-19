import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const CMS_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL;

/**
 * Check if we're in CMS edit mode by reading the cookie.
 * The cookie is set by middleware when ?edit=true is in the URL.
 *
 * This function safely handles both server and client contexts.
 */
function isEditMode(): boolean {
  // Server-side: try to read from next/headers cookies
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid bundling next/headers in client code
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      return cookieStore.get('cms-edit-mode')?.value === 'true';
    } catch {
      // cookies() throws when not in a request context
      return false;
    }
  }

  // Client-side: read from document.cookie
  if (typeof document !== 'undefined') {
    return document.cookie.includes('cms-edit-mode=true');
  }

  return false;
}

/**
 * Create a fetch function that respects edit mode.
 * In edit mode, bypasses Next.js Data Cache to ensure fresh data.
 */
function createFetch(): typeof fetch {
  const editMode = isEditMode();

  if (editMode) {
    // Edit mode: bypass cache for fresh data
    return (input, init) => fetch(input, { ...init, cache: 'no-store' });
  }

  // Normal mode: use default caching
  return fetch;
}

// For authenticated requests (CMS write operations)
let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(authToken && { authorization: `Bearer ${authToken}` }),
    },
  };
});

/**
 * Get Apollo Client for queries.
 * Automatically bypasses cache when in edit mode (detected via cookie).
 */
export function getApolloClient() {
  const httpLink = createHttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: createFetch(),
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
}

// Legacy export for backward compatibility
export const apolloClient = getApolloClient();

/**
 * Authenticated client for CMS write operations.
 * Also respects edit mode for cache bypass.
 */
export function getAuthenticatedClient(token: string) {
  const authHttpLink = createHttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: createFetch(),
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return new ApolloClient({
    link: authHttpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
}
