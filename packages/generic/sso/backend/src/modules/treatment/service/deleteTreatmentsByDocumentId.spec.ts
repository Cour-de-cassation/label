import { idModule, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../repository';
import { deleteTreatmentsByDocumentId } from './deleteTreatmentsByDocumentId';

describe('deleteTreatmentsByDocumentId', () => {
  const treatmentRepository = buildTreatmentRepository();

  it('should remove all the treatments from the database with the given document id', async () => {
    const documentId = idModule.lib.buildId();
    const treatments = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(treatmentModule.generator.generate);
    await Promise.all(treatments.map(treatmentRepository.insert));

    await deleteTreatmentsByDocumentId(documentId);

    const treatmentsAfterRemove = await treatmentRepository.findAll();
    expect(treatmentsAfterRemove).toEqual([treatments[2]]);
  });
});
