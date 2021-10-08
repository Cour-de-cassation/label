import { omit } from 'lodash';
import { statisticModule, treatmentModule } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { up, down } from '../migrations/23_616060cf71da9eeb078b27da';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add annotationsCount in statistic and treatment model', () => {
  const statisticWithNewModel = statisticModule.generator.generate({
    subAnnotationsNonSensitiveCount: 2,
    surAnnotationsCount: 3,
    subAnnotationsSensitiveCount: 1,
  });

  const treatmentWithNewModel = treatmentModule.generator.generate({
    subAnnotationsNonSensitiveCount: 2,
    surAnnotationsCount: 3,
    subAnnotationsSensitiveCount: 1,
  });

  const statisticWithOldModel = {
    ...omit(statisticWithNewModel, [
      'subAnnotationsNonSensitiveCount',
      'surAnnotationsCount',
      'subAnnotationsSensitiveCount',
    ]),
    addedAnnotationsCount: { sensitive: 1, other: 2 },
    deletedAnnotationsCount: { anonymised: 3, other: 0 },
    modifiedAnnotationsCount: {
      nonAnonymisedToSensitive: 0,
      anonymisedToNonAnonymised: 0,
      other: 0,
    },
    resizedBiggerAnnotationsCount: { sensitive: 0, other: 0 },
    resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
  };

  const treatmentWithOldModel = {
    ...omit(treatmentWithNewModel, [
      'subAnnotationsNonSensitiveCount',
      'surAnnotationsCount',
      'subAnnotationsSensitiveCount',
    ]),
    addedAnnotationsCount: { sensitive: 1, other: 2 },
    deletedAnnotationsCount: { anonymised: 3, other: 0 },
    modifiedAnnotationsCount: {
      nonAnonymisedToSensitive: 0,
      anonymisedToNonAnonymised: 0,
      other: 0,
    },
    resizedBiggerAnnotationsCount: { sensitive: 0, other: 0 },
    resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
  };

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insert(statisticWithOldModel as any);
    const treatmentRepository = buildTreatmentRepository();
    await treatmentRepository.insert(treatmentWithOldModel as any);

    await up();

    const statisticAfterUpdateModel = await statisticRepository.findById(
      statisticWithOldModel._id,
    );
    expect(statisticAfterUpdateModel).toEqual(statisticWithNewModel);
    const treatmentAfterUpdateModel = await treatmentRepository.findById(
      treatmentWithOldModel._id,
    );
    expect(treatmentAfterUpdateModel).toEqual(treatmentWithNewModel);
  });

  it('should test down', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insert(statisticWithNewModel as any);
    const treatmentRepository = buildTreatmentRepository();
    await treatmentRepository.insert(treatmentWithNewModel as any);

    await down();

    const statisticAfterUpdateModel = await statisticRepository.findById(
      statisticWithNewModel._id,
    );
    expect(statisticAfterUpdateModel).toEqual(statisticWithOldModel);
    const treatmentAfterUpdateModel = await treatmentRepository.findById(
      treatmentWithNewModel._id,
    );
    expect(treatmentAfterUpdateModel).toEqual(treatmentWithOldModel);
  });
});
