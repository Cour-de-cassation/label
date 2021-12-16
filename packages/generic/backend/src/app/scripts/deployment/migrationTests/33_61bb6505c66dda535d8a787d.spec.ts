import { treatmentModule, treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { up, down } from '../migrations/33_61bb6505c66dda535d8a787d';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add idleDuration in treatment model', () => {
  const treatmentsWithNewModel = [
    treatmentModule.generator.generate({}),
    treatmentModule.generator.generate({}),
    treatmentModule.generator.generate({}),
  ];
  const treatmentsWithOldModel = [
    { ...treatmentsWithNewModel[0], idleDuration: 0 },
    { ...treatmentsWithNewModel[1], idleDuration: 0 },
    { ...treatmentsWithNewModel[2], idleDuration: 0 },
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
