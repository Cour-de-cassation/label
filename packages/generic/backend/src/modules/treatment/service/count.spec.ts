import { idModule, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../repository';
import { countTreatmentsByDocumentId } from './count';

describe('count', () => {
  const treatmentRepository = buildTreatmentRepository();

  it('count the treatments by documentId', async () => {
    const documentId = idModule.lib.buildId();
    const treatments = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(treatmentModule.generator.generate);
    await Promise.all(treatments.map(treatmentRepository.insert));

    const count = await countTreatmentsByDocumentId({ documentId });

    expect(count).toEqual(2);
  });
});
