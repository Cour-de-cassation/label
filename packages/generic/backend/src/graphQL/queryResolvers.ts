import { GraphQLFieldResolver } from 'graphql';
import { graphQLQuery, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { annotationService } from '../modules/annotation';
import { documentService } from '../modules/document';
import { problemReportService } from '../modules/problemReport';
import { logger } from '../utils';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';
import { resolversType } from './resolversType';

export { _typeCheck as queryResolvers };

const queryResolvers: resolversType<typeof graphQLQuery> = {
  annotations: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (_, { documentId }) => {
      try {
        const annotations = await annotationService.fetchAnnotationsOfDocument(
          documentId,
        );

        return annotations;
      } catch (error) {
        logger.error(error);
        throw new Error(error);
      }
    },
  }),

  document: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (user, { documentIdsToExclude }) => {
      try {
        const document = await documentService.fetchDocumentForUser(
          user._id,
          documentIdsToExclude.map(idModule.lib.buildId),
        );

        return document;
      } catch (error) {
        logger.error(error);
        throw new Error(error);
      }
    },
  }),

  documents: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async () => {
      try {
        const documents = await documentService.fetchDocuments();

        return documents;
      } catch (error) {
        logger.error(error);
        throw new Error(error);
      }
    },
  }),

  problemReports: buildAuthenticatedResolver({
    permissions: ['admin'],
    resolver: async () => {
      try {
        const problemReports = await problemReportService.fetchProblemReports();
        return problemReports;
      } catch (error) {
        logger.error(error);
        throw new Error(error);
      }
    },
  }),

  settings: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async () => {
      try {
        const settings = {
          json: JSON.stringify(settingsLoader.getSettings()),
        };
        return settings;
      } catch (error) {
        logger.error(error);
        throw new Error(error);
      }
    },
  }),
};

const _typeCheck: {
  [queryEntry in keyof typeof graphQLQuery]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = queryResolvers;
