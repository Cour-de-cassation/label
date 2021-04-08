import {
  assignationModule,
  documentModule,
  idModule,
  problemReportModule,
  userModule,
} from '@label/core';
import { buildUserRepository } from '../../user';
import { buildAssignationRepository } from '../../assignation';
import { buildDocumentRepository } from '../../document';
import { buildProblemReportRepository } from '../repository';
import { problemReportService } from './problemReportService';

describe('problemReportService', () => {
  describe('deleteProblemReportsByAssignationId', () => {
    it('should remove all the problem reports from the database with the given assignation id', async () => {
      const problemReportRepository = buildProblemReportRepository();
      const assignationId = idModule.lib.buildId();
      const problemReports = ([
        { assignationId },
        { assignationId },
        { assignationId: idModule.lib.buildId() },
      ] as const).map(problemReportModule.generator.generate);
      await Promise.all(problemReports.map(problemReportRepository.insert));

      await problemReportService.deleteProblemReportsByAssignationId(
        assignationId,
      );

      const problemReportsAfterRemove = await problemReportRepository.findAll();
      expect(problemReportsAfterRemove).toEqual([problemReports[2]]);
    });
  });

  describe('fetchDocumentIdAssignatedToUserId', () => {
    const assignationRepository = buildAssignationRepository();
    const problemReportRepository = buildProblemReportRepository();

    const userId = idModule.lib.buildId();
    const documentId = idModule.lib.buildId();
    const problemText = 'PROBLEM_TEXT';
    const problemType = 'bug';
    const assignation = assignationModule.generator.generate({
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
        date: problemReport.date,
        _id: problemReport._id,
        hasBeenRead: problemReport.hasBeenRead,
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

  describe('fetchProblemReports', () => {
    const problemReportRepository = buildProblemReportRepository();
    const assignationRepository = buildAssignationRepository();
    const documentRepository = buildDocumentRepository();
    const userRepository = buildUserRepository();

    const document1 = documentModule.generator.generate();
    const document2 = documentModule.generator.generate();
    const userName1 = 'userName 1';
    const userName2 = 'userName 2';
    const user1 = userModule.generator.generate({ name: userName1 });
    const user2 = userModule.generator.generate({ name: userName2 });
    const assignation1 = assignationModule.generator.generate({
      documentId: document1._id,
      userId: user1._id,
    });
    const assignation2 = assignationModule.generator.generate({
      documentId: document2._id,
      userId: user2._id,
    });
    const problemText1 = 'PROBLEM_TEXT1';
    const problemText2 = 'PROBLEM_TEXT2';
    const problemType = 'bug';
    const problemReport1 = problemReportModule.generator.generate({
      assignationId: assignation1._id,
      text: problemText1,
      type: problemType,
    });
    const problemReport2 = problemReportModule.generator.generate({
      assignationId: assignation2._id,
      text: problemText2,
      type: problemType,
    });

    it('should fetch all the problem reports', async () => {
      await userRepository.insert(user1);
      await userRepository.insert(user2);
      await assignationRepository.insert(assignation1);
      await assignationRepository.insert(assignation2);
      await problemReportRepository.insert(problemReport1);
      await problemReportRepository.insert(problemReport2);
      await documentRepository.insert(document1);
      await documentRepository.insert(document2);

      const problemReports = await problemReportService.fetchProblemReportsWithDetails();

      expect(problemReports.length).toBe(2);
      expect(problemReports[0].problemReport.text).toBe(problemText1);
      expect(problemReports[0].userName).toBe(userName1);
      expect(problemReports[1].problemReport.text).toBe(problemText2);
      expect(problemReports[1].userName).toBe(userName2);
    });
  });

  describe('updateHasBeenRead', () => {
    it('should update the hasBeenRead value', async () => {
      const problemReportRepository = buildProblemReportRepository();
      const problemReport = problemReportModule.generator.generate({
        hasBeenRead: true,
      });
      await problemReportRepository.insert(problemReport);

      await problemReportService.updateHasBeenRead(problemReport._id, false);

      const updatedProblemReport = await problemReportRepository.findById(
        problemReport._id,
      );
      expect(updatedProblemReport.hasBeenRead).toBe(false);
    });
  });
});
