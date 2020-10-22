import { GraphQLList, GraphQLString } from 'graphql';
import { annotationModule } from '@label/core';
import { buildGraphQLInputType, successGraphQLType } from '../../../graphQL';
import { resolveAnnotationsMutation } from './resolvers';

export { annotationsGraphQLMutation };

const annotationsGraphQLMutation = {
  resolve: resolveAnnotationsMutation,
  type: successGraphQLType,
  args: {
    documentIdString: {
      type: GraphQLString,
    },
    fetchedGraphQLAnnotations: {
      type: new GraphQLList(
        buildGraphQLInputType(
          'fetchedAnnotationType',
          annotationModule.dataModel,
        ),
      ),
    },
  },
};
