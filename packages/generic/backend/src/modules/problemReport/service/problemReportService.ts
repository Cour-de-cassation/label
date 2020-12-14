import { idType, problemReportModule, problemReportType } from '@label/core';
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
        text: problemText,
        type: problemType,
      }),
    );
  },

  async fetchProblemReports() {
    const problemReportRepository = buildProblemReportRepository();
    const problemReports = await problemReportRepository.findAll();
    return problemReports;
  },
};
