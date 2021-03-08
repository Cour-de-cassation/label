import { apiSchema, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { annotationReportService } from '../modules/annotationReport';
import { assignationService } from '../modules/assignation';
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
    annotationReport: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { documentId } }) =>
        annotationReportService.fetchAnnotationReportOfDocument(
          idModule.lib.buildId(documentId),
        ),
    }),

    annotations: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { documentId } }) =>
        treatmentService.fetchAnnotationsOfDocument(
          idModule.lib.buildId(documentId),
        ),
    }),

    document: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { documentId } }) =>
        documentService.fetchDocument(idModule.lib.buildId(documentId)),
    }),

    documentToBeTreated: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { documentIdsToExclude } }) =>
        documentService.fetchDocumentForUser(
          user._id,
          documentIdsToExclude.map(idModule.lib.buildId),
        ),
    }),

    problemReportsWithDetails: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () =>
        problemReportService.fetchProblemReportsWithDetails(),
    }),

    settings: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async () => ({
        json: JSON.stringify(settingsLoader.getSettings()),
      }),
    }),

    treatmentsWithDetails: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () =>
        treatmentService.fetchAssignatedTreatmentsWithDetails(),
    }),
  },

  post: {
    async login({ args: { email, password } }) {
      const { email: userEmail, name, role, token } = await userService.login({
        email,
        password,
      });
      return { email: userEmail, name, role, token };
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

    updateAssignationDocumentStatus: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (_, { args: { assignationId, status } }) => {
        await assignationService.updateAssignationDocumentStatus(
          idModule.lib.buildId(assignationId),
          status,
        );
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

    updateTreatment: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (
        user,
        { args: { annotationsDiff, documentId } },
      ) => {
        await treatmentService.updateTreatment({
          annotationsDiff,
          documentId: idModule.lib.buildId(documentId),
          userId: user._id,
        });
      },
    }),

    async signUpUser({ args: { email, password, name } }) {
      await userService.signUpUser({ email, password, name });
    },
  },
};
