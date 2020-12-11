import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../../config/environment';
import { localStorage } from '../localStorage';

export { client };

const httpLink = createHttpLink({
  uri: `${environment.API_URL}/graphql`,
});

const authenticationLink = setContext((_, { headers }: { headers: Record<string, string> }) => {
  const bearerToken = localStorage.bearerTokenHandler.get();
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
      errorPolicy: 'none',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    },
  },
});
