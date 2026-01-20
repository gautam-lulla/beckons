import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const CMS_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL;

/**
 * Check if we're in CMS edit mode by reading the cookie.
 * The cookie is set by middleware when ?edit=true is in the URL.
 *
 * This function safely handles both server and client contexts.
 * For Next.js 15+, cookies() is async so we use a sync fallback.
 */
async function isEditModeAsync(): Promise<boolean> {
  // Server-side: try to read from next/headers cookies
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid bundling next/headers in client code
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { cookies } = require('next/headers');
      const cookieStore = await cookies();
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
 * Synchronous edit mode check for module initialization.
 * Returns false for safety - actual edit mode is handled per-request.
 */
function isEditModeSync(): boolean {
  // Client-side: read from document.cookie
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return document.cookie.includes('cms-edit-mode=true');
  }
  // Server-side at module init time: can't access cookies synchronously
  return false;
}

/**
 * Create a fetch function that respects edit mode.
 * In edit mode, bypasses Next.js Data Cache to ensure fresh data.
 */
function createFetch(editMode: boolean = false): typeof fetch {
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
 * For server components, use getApolloClientAsync for proper edit mode detection.
 */
export function getApolloClient(editMode: boolean = false) {
  const httpLink = createHttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: createFetch(editMode),
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

/**
 * Get Apollo Client with async edit mode detection.
 * Use this in server components for proper cache handling.
 */
export async function getApolloClientAsync() {
  const editMode = await isEditModeAsync();
  return getApolloClient(editMode);
}

// Legacy export for backward compatibility - uses sync edit mode check
export const apolloClient = getApolloClient(isEditModeSync());

/**
 * Authenticated client for CMS write operations.
 * Also respects edit mode for cache bypass.
 */
export function getAuthenticatedClient(token: string, editMode: boolean = false) {
  const authHttpLink = createHttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: createFetch(editMode),
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
