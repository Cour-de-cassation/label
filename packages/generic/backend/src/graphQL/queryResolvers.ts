import { GraphQLFieldResolver } from 'graphql';
import { graphQLQuery, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { annotationService } from '../modules/annotation';
import { documentService } from '../modules/document';
import { problemReportService } from '../modules/problemReport';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';
import { resolversType } from './resolversType';

export { _typeCheck as queryResolvers };

const queryResolvers: resolversType<typeof graphQLQuery> = {
  annotations: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (_, { documentId }) =>
      annotationService.fetchAnnotationsOfDocument(documentId),
  }),

  document: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (user, { documentIdsToExclude }) =>
      documentService.fetchDocumentForUser(
        user._id,
        documentIdsToExclude.map(idModule.lib.buildId),
      ),
  }),

  problemReports: buildAuthenticatedResolver({
    permissions: ['admin'],
    resolver: async () => problemReportService.fetchProblemReports(),
  }),
  settings: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async () => ({
      json: JSON.stringify(settingsLoader.getSettings()),
    }),
  }),
};

const _typeCheck: {
  [queryEntry in keyof typeof graphQLQuery]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = queryResolvers;
