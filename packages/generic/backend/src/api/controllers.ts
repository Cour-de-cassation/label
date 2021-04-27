import { apiSchema, idModule } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { annotationReportService } from '../modules/annotationReport';
import { assignationService } from '../modules/assignation';
import { documentService } from '../modules/document';
import { monitoringEntryService } from '../modules/monitoringEntry';
import { problemReportService } from '../modules/problemReport';
import { statisticService } from '../modules/statistic';
import { treatmentService } from '../modules/treatment';
import { userService } from '../modules/user';
import { buildAuthenticatedController } from './buildAuthenticatedController';
import { controllersFromSchemaType } from './controllerType';

export { controllers };

const controllers: controllersFromSchemaType<typeof apiSchema> = {
  get: {
    aggregatedStatistics: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { ressourceFilter } }) =>
        statisticService.fetchAggregatedStatisticsAccordingToFilter({
          ...ressourceFilter,
          userId:
            ressourceFilter.userId !== undefined
              ? idModule.lib.buildId(ressourceFilter.userId)
              : undefined,
        }),
    }),

    annotationsDiffDetails: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { documentId } }) =>
        treatmentService.fetchAnnotationsDiffDetailsForDocument(
          idModule.lib.buildId(documentId),
        ),
    }),

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

    async anonymizedDocumentText({ args: { documentId } }) {
      return documentService.fetchAnonymizedDocumentText(
        idModule.lib.buildId(documentId),
      );
    },

    availableStatisticFilters: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () =>
        statisticService.fetchAvailableStatisticFilters(),
    }),

    document: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { documentId } }) =>
        documentService.fetchDocument(idModule.lib.buildId(documentId)),
    }),

    documentsForUser: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { documentsMaxCount } }) =>
        documentService.fetchDocumentsForUser(user._id, documentsMaxCount),
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

    specialDocuments: buildAuthenticatedController({
      permissions: ['admin', 'specialDocumentAnnotator'],
      controllerWithUser: async () => documentService.fetchSpecialDocuments(),
    }),

    treatedDocuments: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () => documentService.fetchTreatedDocuments(),
    }),

    untreatedDocuments: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () => documentService.fetchUntreatedDocuments(),
    }),

    usersWithDetails: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async () => userService.fetchUsersWithDetails(),
    }),
  },

  post: {
    createUser: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: (_, { args: { name, email, role } }) => {
        return userService.createUser({
          name,
          email,
          role,
        });
      },
    }),
    changePassword: buildAuthenticatedController({
      permissions: ['admin', 'annotator', 'specialDocumentAnnotator'],
      controllerWithUser: async (
        user,
        { args: { previousPassword, newPassword } },
      ) => userService.changePassword({ user, previousPassword, newPassword }),
    }),

    deleteProblemReport: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { problemReportId } }) =>
        problemReportService.deleteProblemReportById(
          idModule.lib.buildId(problemReportId),
        ),
    }),

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

    resetPassword: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { userId } }) =>
        userService.resetPassword(idModule.lib.buildId(userId)),
    }),

    updateAssignationDocumentStatus: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (_, { args: { assignationId, status } }) => {
        return assignationService.updateAssignationDocumentStatus(
          idModule.lib.buildId(assignationId),
          status,
        );
      },
    }),

    updateDocumentStatus: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (user, { args: { documentId, status } }) => {
        if (user.role !== 'admin') {
          await assignationService.assertDocumentIsAssignatedToUser({
            documentId: idModule.lib.buildId(documentId),
            userId: user._id,
          });
        }
        return documentService.updateDocumentStatus(
          idModule.lib.buildId(documentId),
          status,
        );
      },
    }),

    updateProblemReportHasBeenRead: buildAuthenticatedController({
      permissions: ['admin'],
      controllerWithUser: async (
        _,
        { args: { problemReportId, hasBeenRead } },
      ) => {
        return problemReportService.updateHasBeenRead(
          idModule.lib.buildId(problemReportId),
          hasBeenRead,
        );
      },
    }),

    updateTreatment: buildAuthenticatedController({
      permissions: ['admin', 'annotator'],
      controllerWithUser: async (
        user,
        { args: { annotationsDiff, documentId } },
      ) => {
        return treatmentService.updateTreatment({
          annotationsDiff,
          documentId: idModule.lib.buildId(documentId),
          userId: user._id,
        });
      },
    }),
  },
};
