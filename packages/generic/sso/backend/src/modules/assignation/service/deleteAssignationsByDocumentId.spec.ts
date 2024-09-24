import {
  assignationModule,
  idModule,
  problemReportModule,
  treatmentModule,
} from '@label/core';
import { buildProblemReportRepository } from '../../problemReport';
import { buildTreatmentRepository } from '../../treatment';
import { buildAssignationRepository } from '../repository';
import { deleteAssignationsByDocumentId } from './deleteAssignationsByDocumentId';

describe('deleteAssignationsByDocumentId', () => {
  it('should delete treatments and assignations', async () => {
    const assignationRepository = buildAssignationRepository();
    const problemReportRepository = buildProblemReportRepository();
    const treatmentRepository = buildTreatmentRepository();
    const documentId = idModule.lib.buildId();
    const treatment = treatmentModule.generator.generate();
    const assignation = assignationModule.generator.generate({
      treatmentId: treatment._id,
      documentId,
    });
    const problemReport = problemReportModule.generator.generate({
      documentId,
    });
    await assignationRepository.insert(assignation);
    await problemReportRepository.insert(problemReport);
    await treatmentRepository.insert(treatment);

    await deleteAssignationsByDocumentId(documentId);

    const assignations = await assignationRepository.findAll();
    const treatments = await treatmentRepository.findAll();
    expect(assignations).toEqual([]);
    expect(treatments).toEqual([]);
  });
});
