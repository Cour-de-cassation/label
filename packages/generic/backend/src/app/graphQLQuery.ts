import { GraphQLObjectType } from 'graphql';
import { annotationsGraphQLQuery } from '../modules/annotation';
import { documentsGraphQLQuery } from '../modules/document';

export { graphQLQuery };

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    annotations: annotationsGraphQLQuery,
    documents: documentsGraphQLQuery,
  },
});
