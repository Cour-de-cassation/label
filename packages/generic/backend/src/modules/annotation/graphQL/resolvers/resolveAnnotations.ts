import { GraphQLFieldResolver } from 'graphql';
import { annotationService } from '../../service';

export { resolveAnnotations };

const resolveAnnotations: GraphQLFieldResolver<any, any, any> = async (
  _root,
  { documentId }: { documentId: string },
) => {
  return await annotationService.fetchAnnotationsOfDocument(documentId);
};
