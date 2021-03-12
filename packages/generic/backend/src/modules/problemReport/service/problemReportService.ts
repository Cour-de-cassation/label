import {
  idModule,
  idType,
  problemReportModule,
  problemReportType,
} from '@label/core';
import { userService } from '../../user';
import { assignationService } from '../../assignation';
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
        text: problemText,
        type: problemType,
      }),
    );
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

    const userNamesByAssignationId = await userService.fetchUserNamesByAssignationId(
      assignationsById,
    );

    return problemReports.map((problemReport) => {
      const assignationIdString = idModule.lib.convertToString(
        problemReport.assignationId,
      );
      const userName = userNamesByAssignationId[assignationIdString];
      const assignation = assignationsById[assignationIdString];
      return { problemReport, userName, documentId: assignation.documentId };
    });
  },
};
