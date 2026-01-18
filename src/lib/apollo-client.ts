import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL,
});

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

// Client for server-side queries (no auth needed for public reads)
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

// Authenticated client for CMS write operations
export function getAuthenticatedClient(token: string) {
  const authHttpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL,
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
