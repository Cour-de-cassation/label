import { assignationModule, idModule } from '@label/core';
import { buildAssignationRepository } from '../../assignation';
import { buildProblemReportRepository } from '../repository';
import { problemReportService } from './problemReportService';

describe('problemReportService', () => {
  describe('fetchDocumentIdAssignatedToUserId', () => {
    const assignationRepository = buildAssignationRepository();
    const problemReportRepository = buildProblemReportRepository();

    const userId = idModule.lib.buildId();
    const documentId = idModule.lib.buildId();
    const problemText = 'PROBLEM_TEXT';
    const problemType = 'bug';
    const assignation = assignationModule.lib.buildAssignation({
      userId,
      documentId,
    });

    it('should create a problem report', async () => {
      await assignationRepository.insert(assignation);

      await problemReportService.createProblemReport({
        userId,
        documentId,
        problemText,
        problemType,
      });

      const problemReport = (await problemReportRepository.findAll())[0];
      expect(problemReport).toEqual({
        assignationId: assignation._id,
        _id: problemReport._id,
        text: problemText,
        type: problemType,
      });
    });

    it('should throw if there is no assignation for the given userId and documentId', async () => {
      const promise = () =>
        problemReportService.createProblemReport({
          userId,
          documentId,
          problemText,
          problemType,
        });

      await expect(promise()).rejects.toThrow(
        `No assignation for the given user ${userId} and document ${documentId}`,
      );
    });
  });
});
