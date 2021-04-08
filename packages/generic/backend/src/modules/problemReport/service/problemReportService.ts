import {
  idModule,
  idType,
  problemReportModule,
  problemReportType,
} from '@label/core';
import { assignationService } from '../../assignation';
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
    const assignationId = await assignationService.fetchAssignationId({
      userId,
      documentId,
    });

    if (!assignationId) {
      throw new Error(
        `No assignation for the given user ${userId} and document ${documentId}`,
      );
    }

    await problemReportRepository.insert(
      problemReportModule.lib.buildProblemReport({
        assignationId,
        date: new Date().getTime(),
        hasBeenRead: false,
        text: problemText,
        type: problemType,
      }),
    );
  },

  async deleteProblemReportsByAssignationId(
    assignationId: problemReportType['assignationId'],
  ) {
    const problemReportRepository = buildProblemReportRepository();
    await problemReportRepository.deleteByAssignationId(assignationId);
  },

  async fetchProblemReportsWithDetails() {
    const problemReportRepository = buildProblemReportRepository();
    const problemReports = await problemReportRepository.findAll();
    const assignationIds = problemReports.map(
      (problemReport) => problemReport.assignationId,
    );
    const assignationsById = await assignationService.fetchAllAssignationsById(
      assignationIds,
    );

    const documentsById = await documentService.fetchAllDocumentsByIds(
      Object.values(assignationsById).map(({ documentId }) => documentId),
    );

    const userNamesByAssignationId = await userService.fetchUserNamesByAssignationId(
      assignationsById,
    );

    return problemReports.map((problemReport) => {
      const assignationIdString = idModule.lib.convertToString(
        problemReport.assignationId,
      );
      const userName = userNamesByAssignationId[assignationIdString];
      const assignation = assignationsById[assignationIdString];
      const document =
        documentsById[idModule.lib.convertToString(assignation.documentId)];

      return {
        problemReport,
        userName,
        document: {
          _id: document._id,
          documentId: document.documentId,
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
