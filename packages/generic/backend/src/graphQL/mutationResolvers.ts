import { GraphQLFieldResolver } from 'graphql';
import { graphQLMutation, idModule } from '@label/core';
import { annotationService } from '../modules/annotation';
import { documentService } from '../modules/document';
import { monitoringEntryService } from '../modules/monitoringEntry';
import { problemReportService } from '../modules/problemReport';
import { treatmentService } from '../modules/treatment';
import { userService } from '../modules/user';
import { logger } from '../utils';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';
import { resolversType } from './resolversType';

export { _typeCheck as mutationResolvers };

const mutationResolvers: resolversType<typeof graphQLMutation> = {
  monitoringEntry: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (user, { newMonitoringEntry }) => {
      try {
        await monitoringEntryService.create({
          ...newMonitoringEntry,
          documentId: idModule.lib.buildId(newMonitoringEntry.documentId),
          _id: idModule.lib.buildId(newMonitoringEntry._id),
          userId: user._id,
        });

        return { success: true };
      } catch (e) {
        logger.error(e);
        return { success: false };
      }
    },
  }),

  problemReport: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (user, { documentId, problemText, problemType }) => {
      try {
        await problemReportService.createProblemReport({
          userId: user._id,
          documentId: idModule.lib.buildId(documentId),
          problemText,
          problemType,
        });

        return { success: true };
      } catch (e) {
        logger.error(e);
        return { success: false };
      }
    },
  }),

  updateDocumentStatus: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (_, { documentId, status }) => {
      try {
        await documentService.updateDocumentStatus(
          idModule.lib.buildId(documentId),
          status,
        );
        return { success: true };
      } catch (e) {
        logger.error(e);
        return { success: false };
      }
    },
  }),

  async signUpUser(_root, { email, password }) {
    try {
      await userService.signUpUser({ email, password });

      return { success: true };
    } catch (e) {
      logger.error(e);
      return { success: false };
    }
  },

  createTreatment: buildAuthenticatedResolver({
    permissions: ['admin', 'annotator'],
    resolver: async (
      user,
      { documentId, fetchedGraphQLAnnotations, duration },
    ) => {
      try {
        await treatmentService.createTreatment({
          userId: user._id,
          documentId: idModule.lib.buildId(documentId),
          duration,
          annotationIds: fetchedGraphQLAnnotations.map(({ _id }) =>
            idModule.lib.buildId(_id),
          ),
        });

        await annotationService.updateAnnotations(
          idModule.lib.buildId(documentId),
          fetchedGraphQLAnnotations.map((fetchedGraphQLAnnotation) => ({
            ...fetchedGraphQLAnnotation,
            _id: idModule.lib.buildId(fetchedGraphQLAnnotation._id),
          })),
        );

        return { success: true };
      } catch (e) {
        logger.error(e);
        return { success: false };
      }
    },
  }),
};

const _typeCheck: {
  [queryEntry in keyof typeof graphQLMutation]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = mutationResolvers;
