import { documentModule, problemReportModule, userModule } from '@label/core';
import { buildUserRepository } from '../../user';
import { buildDocumentRepository } from '../../document';
import { buildProblemReportRepository } from '../repository';
import { problemReportService } from './problemReportService';

describe('problemReportService', () => {
  describe('fetchProblemReports', () => {
    const problemReportRepository = buildProblemReportRepository();
    const documentRepository = buildDocumentRepository();
    const userRepository = buildUserRepository();

    const document1 = documentModule.generator.generate();
    const document2 = documentModule.generator.generate();
    const userName1 = 'userName 1';
    const userName2 = 'userName 2';
    const user1 = userModule.generator.generate({ name: userName1 });
    const user2 = userModule.generator.generate({ name: userName2 });
    const problemText1 = 'PROBLEM_TEXT1';
    const problemText2 = 'PROBLEM_TEXT2';
    const problemType = 'bug';
    const problemReport1 = problemReportModule.generator.generate({
      documentId: document1._id,
      userId: user1._id,
      text: problemText1,
      type: problemType,
    });
    const problemReport2 = problemReportModule.generator.generate({
      documentId: document2._id,
      userId: user2._id,
      text: problemText2,
      type: problemType,
    });

    it('should fetch all the problem reports', async () => {
      await userRepository.insert(user1);
      await userRepository.insert(user2);
      await problemReportRepository.insert(problemReport1);
      await problemReportRepository.insert(problemReport2);
      await documentRepository.insert(document1);
      await documentRepository.insert(document2);

      const problemReports = await problemReportService.fetchProblemReportsWithDetails();

      expect(problemReports.length).toBe(2);
      expect(problemReports[0].problemReport.text).toBe(problemText1);
      expect(problemReports[0].user.name).toBe(userName1);
      expect(problemReports[1].problemReport.text).toBe(problemText2);
      expect(problemReports[1].user.name).toBe(userName2);
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
