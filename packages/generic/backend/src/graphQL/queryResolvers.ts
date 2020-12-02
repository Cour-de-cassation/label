import { GraphQLFieldResolver } from 'graphql';
import { graphQLQuery, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { annotationService } from '../modules/annotation';
import { documentService } from '../modules/document';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';
import { resolversType } from './resolversType';

export { _typeCheck as queryResolvers };

const queryResolvers: resolversType<typeof graphQLQuery> = {
  annotations: async (_, { documentId }) =>
    annotationService.fetchAnnotationsOfDocument(documentId),

  document: buildAuthenticatedResolver(
    async (userId, { documentIdsToExclude }) =>
      documentService.fetchDocumentForUser(
        userId,
        documentIdsToExclude.map(idModule.lib.buildId),
      ),
  ),

  settings: async () => ({
    json: JSON.stringify(settingsLoader.getSettings()),
  }),
};

const _typeCheck: {
  [queryEntry in keyof typeof graphQLQuery]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = queryResolvers;
