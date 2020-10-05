import { GraphQLList, GraphQLString } from 'graphql';
import { annotationModule } from '@label/core';
import { buildGraphQLType } from '../../../graphQL';
import { resolveAnnotations } from './resolvers';

export { annotationsGraphQLQuery };

const annotationsGraphQLQuery = {
  resolve: resolveAnnotations,
  type: new GraphQLList(
    buildGraphQLType('annotationType', annotationModule.dataModel),
  ),
  args: {
    documentId: {
      type: GraphQLString,
    },
  },
};
