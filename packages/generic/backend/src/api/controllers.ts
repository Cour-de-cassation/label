import { apiSchema, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { documentService } from '../modules/document';
import { monitoringEntryService } from '../modules/monitoringEntry';
import { problemReportService } from '../modules/problemReport';
import { treatmentService } from '../modules/treatment';
import { userService } from '../modules/user';
import { buildAuthenticatedController } from './buildAuthenticatedController';
import { controllersFromSchemaType } from './controllerType';

export { controllers };

const controllers: controllersFromSchemaType<typeof apiSchema> = {
  get: {
    annotations: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { documentId } }) =>
        treatmentService.fetchAnnotationsOfDocument(
          idModule.lib.buildId(documentId),
        ),
    }),

    document: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { documentIdsToExclude } }) =>
        documentService.fetchDocumentForUser(
          user._id,
          documentIdsToExclude.map(idModule.lib.buildId),
        ),
    }),

    problemReports: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () =>
        problemReportService.fetchProblemReports(),
    }),

    settings: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async () => ({
        json: JSON.stringify(settingsLoader.getSettings()),
      }),
    }),

    treatments: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () => treatmentService.fetchTreatments(),
    }),
  },

  post: {
    createTreatment: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (
        _,
        { args: { annotationsDiff, documentId, duration } },
      ) => {
        await treatmentService.createTreatment({
          annotationsDiff,
          documentId: idModule.lib.buildId(documentId),
          duration,
        });

        /*await annotationService.updateAnnotations(
          idModule.lib.buildId(documentId),
          fetchedGraphQLAnnotations.map((fetchedGraphQLAnnotation) => ({
            ...fetchedGraphQLAnnotation,
            _id: idModule.lib.buildId(fetchedGraphQLAnnotation._id),
          })),
        );*/
      },
    }),

    async login({ args: { email, password } }) {
      return userService.login({ email, password });
    },

    monitoringEntries: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { newMonitoringEntries } }) => {
        const monitoringEntries = newMonitoringEntries.map(
          (newMonitoringEntry) => ({
            ...newMonitoringEntry,
            documentId: idModule.lib.buildId(newMonitoringEntry.documentId),
            _id: idModule.lib.buildId(newMonitoringEntry._id),
            userId: user._id,
          }),
        );
        await monitoringEntryService.createMany(monitoringEntries);
      },
    }),

    problemReport: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (
        user,
        { args: { documentId, problemText, problemType } },
      ) => {
        await problemReportService.createProblemReport({
          userId: user._id,
          documentId: idModule.lib.buildId(documentId),
          problemText,
          problemType,
        });
      },
    }),

    updateDocumentStatus: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { documentId, status } }) => {
        await documentService.updateDocumentStatus(
          idModule.lib.buildId(documentId),
          status,
        );
      },
    }),

    async signUpUser({ args: { email, password } }) {
      await userService.signUpUser({ email, password });
    },
  },
};
