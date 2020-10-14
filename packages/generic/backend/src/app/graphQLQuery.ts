import { GraphQLObjectType } from 'graphql';
import { annotationsGraphQLQuery } from '../modules/annotation';
import { settingsGraphQLQuery } from '../modules/settings';
import { documentGraphQLQuery } from '../modules/document';

export { graphQLQuery };

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    annotations: annotationsGraphQLQuery,
    document: documentGraphQLQuery,
    settings: settingsGraphQLQuery,
  },
});
