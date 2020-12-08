import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { labelApi } from '../labelApi';
import { getBearerTokenFromLocalStorage } from '../localStorage';

export { client };

const httpLink = createHttpLink({
  uri: `${labelApi.getLabelUrl()}/graphql`,
});

const authenticationLink = setContext((_, { headers }: { headers: Record<string, string> }) => {
  const bearerToken = getBearerTokenFromLocalStorage();
  if (!bearerToken) {
    return {
      headers,
    };
  }
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${bearerToken}`,
    },
  };
});

const link = ApolloLink.from([authenticationLink, httpLink]);

const cache = new InMemoryCache({ addTypename: false });

const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});
