import {
  idModule,
  idType,
  problemReportModule,
  problemReportType,
} from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../assignation';
import { buildUserRepository } from '../../user';
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

  async fetchProblemReportsWithDetails() {
    const problemReportRepository = buildProblemReportRepository();
    const assignationRepository = buildAssignationRepository();
    const userRepository = buildUserRepository();
    const problemReports = await problemReportRepository.findAll();
    const assignationIds = problemReports.map(
      (problemReport) => problemReport.assignationId,
    );
    const assignations = await assignationRepository.findAllByIds(
      assignationIds,
    );
    const userIds = assignations.map((assignation) => assignation.userId);
    const users = await userRepository.findAllByIds(userIds);
    const emailsByAssignationId = assignationIds.reduce(
      (accumulator, assignationId) => {
        const assignationIdString = idModule.lib.convertToString(assignationId);
        if (accumulator[assignationIdString]) {
          return accumulator;
        }
        const assignation = assignations.find((assignation) =>
          idModule.lib.equalId(assignation._id, assignationId),
        );
        if (!assignation) {
          return accumulator;
        }
        const user = users.find((user) =>
          idModule.lib.equalId(user._id, assignation.userId),
        );
        if (!user) {
          return accumulator;
        }
        return {
          ...accumulator,
          [assignationIdString]: user.email,
        };
      },
      {} as Record<string, string>,
    );
    return problemReports.map((problemReport) => {
      const email =
        emailsByAssignationId[
          idModule.lib.convertToString(problemReport.assignationId)
        ];
      return { problemReport, email };
    });
  },
};
