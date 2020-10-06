import { GraphQLObjectType } from 'graphql';
import { annotationsGraphQLQuery } from '../modules/annotation';
import { anonymizationSettingsGraphQLQuery } from '../modules/anonymizationSettings';
import { documentsGraphQLQuery } from '../modules/document';

export { graphQLQuery };

const graphQLQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    annotations: annotationsGraphQLQuery,
    anonymizationSettings: anonymizationSettingsGraphQLQuery,
    documents: documentsGraphQLQuery,
  },
});
