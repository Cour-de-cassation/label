import {
  assignationModule,
  documentModule,
  problemReportModule,
  statisticModule,
  treatmentModule,
  userModule,
} from '@label/core';
import { buildAssignationRepository } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { buildProblemReportRepository } from '../../modules/problemReport';
import { buildStatisticRepository } from '../../modules/statistic';
import { buildTreatmentRepository } from '../../modules/treatment';
import { buildUserRepository } from '../../modules/user';
import { clearDb } from './clearDb';

describe('clearDb', () => {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const problemReportRepository = buildProblemReportRepository();
  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();
  const userRepository = buildUserRepository();

  it('should clear the db with the given collection pattern', async () => {
    const assignations = [{}, {}, {}].map(assignationModule.generator.generate);
    const documents = [{}, {}, {}].map(documentModule.generator.generate);
    const problemReports = [{}, {}, {}].map(
      problemReportModule.generator.generate,
    );
    const statistics = [{}, {}, {}].map(statisticModule.generator.generate);
    const treatments = [{}, {}, {}].map(treatmentModule.generator.generate);
    const users = [{}, {}, {}].map(userModule.generator.generate);
    await Promise.all(assignations.map(assignationRepository.insert));
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(problemReports.map(problemReportRepository.insert));
    await Promise.all(statistics.map(statisticRepository.insert));
    await Promise.all(treatments.map(treatmentRepository.insert));
    await Promise.all(users.map(userRepository.insert));

    await clearDb({ user: false });

    const assignationsAfterUpdate = await assignationRepository.findAll();
    const documentsAfterUpdate = await documentRepository.findAll();
    const problemReportsAfterUpdate = await problemReportRepository.findAll();
    const statisticsAfterUpdate = await statisticRepository.findAll();
    const treatmentsAfterUpdate = await treatmentRepository.findAll();
    const usersAfterUpdate = await userRepository.findAll();
    expect(assignationsAfterUpdate).toEqual([]);
    expect(documentsAfterUpdate).toEqual([]);
    expect(problemReportsAfterUpdate).toEqual([]);
    expect(statisticsAfterUpdate).toEqual([]);
    expect(treatmentsAfterUpdate).toEqual([]);
    expect(usersAfterUpdate).toEqual(users);
  });
});
