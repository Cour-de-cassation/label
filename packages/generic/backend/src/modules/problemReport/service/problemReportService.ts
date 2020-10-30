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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isBlocking,
  }: {
    userId: idType;
    documentId: idType;
    problemText: string;
    problemType: problemReportType['type'];
    isBlocking: boolean;
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

    problemReportRepository.insert(
      problemReportModule.lib.buildProblemReport({
        assignationId,
        text: problemText,
        type: problemType,
      }),
    );
  },
};
