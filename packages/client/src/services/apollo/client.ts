import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { environment } from '../../config/environment';

const httpLink = createHttpLink({
  uri: environment.API_URL,
});

const link = ApolloLink.from([httpLink])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
});

export { client }