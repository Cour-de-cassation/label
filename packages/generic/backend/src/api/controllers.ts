import { apiSchema, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { annotationService } from '../modules/annotation';
import { documentService } from '../modules/document';
import { monitoringEntryService } from '../modules/monitoringEntry';
import { problemReportService } from '../modules/problemReport';
import { treatmentService } from '../modules/treatment';
import { userService } from '../modules/user';
import { logger } from '../utils';
import { buildAuthenticatedController } from './buildAuthenticatedController';
import { controllersFromSchemaType } from './controllerType';

export { controllers };

const controllers: controllersFromSchemaType<typeof apiSchema> = {
  get: {
    annotations: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { documentId } }) => {
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

    document: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { documentIdsToExclude } }) => {
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

    problemReports: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () => {
        try {
          const problemReports = await problemReportService.fetchProblemReports();
          return problemReports;
        } catch (error) {
          logger.error(error);
          throw new Error(error);
        }
      },
    }),

    settings: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async () => {
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

    treatments: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () => {
        try {
          const treatments = await treatmentService.fetchTreatments();

          return treatments;
        } catch (error) {
          logger.error(error);
          throw new Error(error);
        }
      },
    }),
  },

  post: {
    monitoringEntry: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { newMonitoringEntry } }) => {
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

    problemReport: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (
        user,
        { args: { documentId, problemText, problemType } },
      ) => {
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

    updateDocumentStatus: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { documentId, status } }) => {
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

    async signUpUser({ args: { email, password } }) {
      try {
        await userService.signUpUser({ email, password });

        return { success: true };
      } catch (e) {
        logger.error(e);
        return { success: false };
      }
    },

    createTreatment: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (
        user,
        { args: { documentId, fetchedGraphQLAnnotations, duration } },
      ) => {
        try {
          await treatmentService.createTreatment({
            userId: user._id,
            documentId: idModule.lib.buildId(documentId),
            duration,
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
  },
};
