import {
  assignationModule,
  documentModule,
  problemReportModule,
  treatmentModule,
  userModule,
} from '@label/core';
import { buildAssignationRepository } from '../../../modules/assignation';
import { buildDocumentRepository } from '../../../modules/document';
import { buildTreatmentRepository } from '../../../modules/treatment';
import { buildProblemReportRepository } from '../../../modules/problemReport';
import { buildUserRepository } from '../../../modules/user';
import { cleanProblemReports } from './cleanProblemReports';

describe('cleanProblemReports', () => {
  const problemReportRepository = buildProblemReportRepository();
  const treatmentRepository = buildTreatmentRepository();
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const userRepository = buildUserRepository();

  const document = documentModule.generator.generate({ status: 'rejected' });
  const treatments = [
    'NLP' as const,
    'postProcess' as const,
    'annotator' as const,
  ].map((source, index) =>
    treatmentModule.generator.generate({
      source,
      documentId: document._id,
      order: index,
    }),
  );
  const user = userModule.generator.generate({
    role: 'annotator',
    name: 'Benoit Serrano',
  });
  const assignation = assignationModule.generator.generate({
    documentId: document._id,
    treatmentId: treatments[2]._id,
    userId: user._id,
  });

  it('should create a problemReport if no one exists', async () => {
    await treatmentRepository.insertMany(treatments);
    await assignationRepository.insert(assignation);
    await documentRepository.insert(document);
    await userRepository.insert(user);

    await cleanProblemReports();

    const problemReports = await problemReportRepository.findAll();
    expect(problemReports.length).toBe(1);
    expect(problemReports[0].assignationId).toEqual(assignation._id);
    expect(problemReports[0].text).toBe(
      `Benoit Serrano a fait un signalement sur cette décision qui a ensuite été supprimé. Ce message est généré automatiquement`,
    );
  });

  it('should not create a problemReport if one exists', async () => {
    const problemReportText = 'Ceci est le texte de mon signalement';
    const problemReport = problemReportModule.generator.generate({
      assignationId: assignation._id,
      text: problemReportText,
    });
    const problemReportRepository = buildProblemReportRepository();

    await treatmentRepository.insertMany(treatments);
    await assignationRepository.insert(assignation);
    await documentRepository.insert(document);
    await userRepository.insert(user);
    await problemReportRepository.insert(problemReport);

    await cleanProblemReports();

    const problemReports = await problemReportRepository.findAll();
    expect(problemReports).toEqual([problemReport]);
  });
});
