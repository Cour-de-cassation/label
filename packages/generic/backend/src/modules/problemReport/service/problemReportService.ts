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
import { logger } from '../../../utils';

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
    const document = await documentService.fetchAllDocumentsByIds([documentId]);
    const user = await userService.fetchUsersByIds([userId]);
    logger.log({
      operationName: 'createProblemReport',
      msg: `Problem reported created on document ${document[0].source}:${document[0].documentNumber} by ${user[0].name}`,
      data: {
        sourceId: document[0].documentNumber,
        sourceName: document[0].source,
        userId: userId,
        userName: user[0].name,
      },
    });
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
      let document = undefined;
      try {
        document =
          documentsById[idModule.lib.convertToString(problemReport.documentId)];
        document = {
          _id: document._id,
          documentNumber: document.documentNumber,
          publicationCategory: document.publicationCategory,
          route: document.route,
          status: document.status,
        };
      } catch (e) {}

      return {
        problemReport,
        user: {
          email,
          name,
        },
        document,
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
