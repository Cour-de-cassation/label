import {
  documentType,
  idModule,
  idType,
  problemReportModule,
  problemReportType,
} from '@label/core';
import { documentService } from '../../document';
import { userService } from '../../user';
import { buildProblemReportRepository } from '../repository';

export { problemReportService };

const problemReportService = {
  async createProblemReport({
    userId,
    documentId,
    problemText,
    problemType,
  }: {
    userId: idType;
    documentId: idType;
    problemText: string;
    problemType: problemReportType['type'];
  }) {
    const problemReportRepository = buildProblemReportRepository();

    await problemReportRepository.insert(
      problemReportModule.lib.buildProblemReport({
        userId,
        documentId,
        date: new Date().getTime(),
        hasBeenRead: false,
        text: problemText,
        type: problemType,
      }),
    );
  },

  async deleteProblemReportById(problemReportId: problemReportType['_id']) {
    const problemReportRepository = buildProblemReportRepository();
    await problemReportRepository.deleteById(problemReportId);
  },

  async deleteProblemReportsByDocumentId(documentId: documentType['_id']) {
    const problemReportRepository = buildProblemReportRepository();
    await problemReportRepository.deleteByDocumentId(documentId);
  },

  async fetchProblemReportsWithDetails() {
    const problemReportRepository = buildProblemReportRepository();
    const problemReports = await problemReportRepository.findAll();

    const documentsById = await documentService.fetchAllDocumentsByIds(
      problemReports.map(({ documentId }) => documentId),
    );

    const usersByIds = await userService.fetchUsersByIds(
      problemReports.map(({ userId }) => userId),
    );

    return problemReports.map((problemReport) => {
      const userIdString = idModule.lib.convertToString(problemReport.userId);
      const { email, name } = usersByIds[userIdString];
      const document =
        documentsById[idModule.lib.convertToString(problemReport.documentId)];

      return {
        problemReport,
        user: {
          email,
          name,
        },
        document: {
          _id: document._id,
          documentNumber: document.documentNumber,
          publicationCategory: document.publicationCategory,
          route: document.route,
          status: document.status,
        },
      };
    });
  },

  async updateHasBeenRead(
    problemReportId: problemReportType['_id'],
    hasBeenRead: problemReportType['hasBeenRead'],
  ) {
    const problemReportRepository = buildProblemReportRepository();
    return problemReportRepository.updateOne(problemReportId, { hasBeenRead });
  },
};
