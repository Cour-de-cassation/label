import { GraphQLObjectType } from 'graphql';
import { documentsQuery } from '../modules/document';

export { graphQLQuery };

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    documents: documentsQuery,
  },
});
