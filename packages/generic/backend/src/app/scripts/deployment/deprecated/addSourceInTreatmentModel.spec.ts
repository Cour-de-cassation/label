import { omit } from 'lodash';
import { treatmentModule, treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { addSourceInTreatmentModel } from './addSourceInTreatmentModel';

describe('addSourceInTreatmentModel.spec', () => {
  it('should add an NLP source the treatment data model in the database', async () => {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = [
      treatmentModule.generator.generate(),
      treatmentModule.generator.generate(),
      treatmentModule.generator.generate(),
    ];
    const treatmentsWithOldModel = treatments.map((treatment) =>
      omit(treatment, ['source']),
    );
    await Promise.all(
      ((treatmentsWithOldModel as any) as treatmentType[]).map(
        treatmentRepository.insert,
      ),
    );

    await addSourceInTreatmentModel();

    const treatmentsAfterUpdateModel = await treatmentRepository.findAll();
    expect(treatmentsAfterUpdateModel.sort()).toEqual(treatments.sort());
  });
});
