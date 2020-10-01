import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../../config/environment';
import { getBearerTokenFromLocalStorage } from '../localStorage';

export { client };

const httpLink = createHttpLink({
  uri: `${environment.API_URL}/graphql`,
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

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});
