import { GraphQLFieldResolver } from 'graphql';
import {
  graphQLReceivedDataType,
  fetchedAnnotationType,
  idModule,
} from '@label/core';
import { annotationService } from '../../service';

export { resolveAnnotationsMutation };

const resolveAnnotationsMutation: GraphQLFieldResolver<any, any, any> = async (
  _root,
  {
    documentIdString,
    fetchedGraphQLAnnotations,
  }: {
    documentIdString: string;
    fetchedGraphQLAnnotations: Array<
      graphQLReceivedDataType<fetchedAnnotationType>
    >;
  },
) => {
  const documentId = idModule.lib.buildId(documentIdString);
  const fetchedAnnotations = fetchedGraphQLAnnotations.map(
    (fetchedGraphQLAnnotation) => ({
      ...fetchedGraphQLAnnotation,
      _id: idModule.lib.buildId(fetchedGraphQLAnnotation._id),
    }),
  );

  await annotationService.updateAnnotations(documentId, fetchedAnnotations);

  return { success: true };
};
