import { GraphQLObjectType } from 'graphql';
import { documentsGraphQLQuery } from '../modules/document';

export { graphQLQuery };

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    documents: documentsGraphQLQuery,
  },
});
