import { omit } from 'lodash';
import { treatmentModule, treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { up, down } from '../migrations/30_618291a325bd9d1925913ed4';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add idleDuration in treatment model', () => {
  const treatmentsWithNewModel = [
    treatmentModule.generator.generate({
      idleDuration: 0,
    }),
    treatmentModule.generator.generate({
      idleDuration: 0,
    }),
    treatmentModule.generator.generate({
      idleDuration: 0,
    }),
  ];
  const treatmentsWithOldModel = [
    omit(treatmentsWithNewModel[0], ['idleDuration']),
    omit(treatmentsWithNewModel[1], ['idleDuration']),
    omit(treatmentsWithNewModel[2], ['idleDuration']),
  ];

  it('should test up', async () => {
    const treatmentRepository = buildTreatmentRepository();
    await Promise.all(
      ((treatmentsWithOldModel as any) as treatmentType[]).map(
        treatmentRepository.insert,
      ),
    );

    await up();

    const treatmentsAfterUpdateModel = await treatmentRepository.findAll();
    expect(treatmentsAfterUpdateModel.sort()).toEqual(
      treatmentsWithNewModel.sort(),
    );
  });

  it('should test down', async () => {
    const treatmentRepository = buildTreatmentRepository();
    await Promise.all(treatmentsWithNewModel.map(treatmentRepository.insert));

    await down();

    const treatmentsAfterUpdateModel = await treatmentRepository.findAll();
    expect(treatmentsAfterUpdateModel.sort()).toEqual(
      treatmentsWithOldModel.sort(),
    );
  });
});
