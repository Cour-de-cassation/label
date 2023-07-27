import {
  statisticModule,
  statisticType,
  treatmentModule,
  treatmentType,
} from '@label/core';
import { buildTreatmentRepository } from '../../../../modules/treatment';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/6_60dee40a398c8791def4a5f4';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
xdescribe('replace addedAnnotationsCount and deletedAnnotationsCount in statistic', () => {
  const statisticsWithNewModel = [
    statisticModule.generator.generate({}),
    statisticModule.generator.generate({
      addedAnnotationsCount: { sensitive: 0, other: 3 },
    } as any),
    statisticModule.generator.generate({
      deletedAnnotationsCount: { anonymised: 0, other: 3 },
    } as any),
    statisticModule.generator.generate({
      addedAnnotationsCount: { sensitive: 0, other: 2 },
      deletedAnnotationsCount: { anonymised: 0, other: 4 },
      resizedSmallerAnnotationsCount: { anonymised: 0, other: 4 },
      resizedBiggerAnnotationsCount: { sensitive: 0, other: 4 },
      modifiedAnnotationsCount: {
        anonymisedToNonAnonymised: 0,
        nonAnonymisedToSensitive: 0,
        other: 4,
      },
    } as any),
  ];
  const statisticsWithOldModel = [
    {
      ...statisticsWithNewModel[0],
      addedAnnotationsCount: 0,
      deletedAnnotationsCount: 0,
      resizedSmallerAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      modifiedAnnotationsCount: 0,
    },
    {
      ...statisticsWithNewModel[1],
      addedAnnotationsCount: 3,
      deletedAnnotationsCount: 0,
      resizedSmallerAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      modifiedAnnotationsCount: 0,
    },
    {
      ...statisticsWithNewModel[2],
      addedAnnotationsCount: 0,
      deletedAnnotationsCount: 3,
      resizedSmallerAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      modifiedAnnotationsCount: 0,
    },
    {
      ...statisticsWithNewModel[3],
      addedAnnotationsCount: 2,
      deletedAnnotationsCount: 4,
      resizedSmallerAnnotationsCount: 4,
      resizedBiggerAnnotationsCount: 4,
      modifiedAnnotationsCount: 4,
    },
  ];

  const treatmentsWithNewModel = [
    treatmentModule.generator.generate({}),
    treatmentModule.generator.generate({
      addedAnnotationsCount: { sensitive: 0, other: 3 },
    } as any),
    treatmentModule.generator.generate({
      deletedAnnotationsCount: { anonymised: 0, other: 3 },
    } as any),
    treatmentModule.generator.generate({
      addedAnnotationsCount: { sensitive: 0, other: 2 },
      deletedAnnotationsCount: { anonymised: 0, other: 4 },
      resizedSmallerAnnotationsCount: { anonymised: 0, other: 4 },
      resizedBiggerAnnotationsCount: { sensitive: 0, other: 4 },
      modifiedAnnotationsCount: {
        anonymisedToNonAnonymised: 0,
        nonAnonymisedToSensitive: 0,
        other: 4,
      },
    } as any),
  ];
  const treatmentsWithOldModel = [
    {
      ...treatmentsWithNewModel[0],
      addedAnnotationsCount: 0,
      deletedAnnotationsCount: 0,
      resizedSmallerAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      modifiedAnnotationsCount: 0,
    },
    {
      ...treatmentsWithNewModel[1],
      addedAnnotationsCount: 3,
      deletedAnnotationsCount: 0,
      resizedSmallerAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      modifiedAnnotationsCount: 0,
    },
    {
      ...treatmentsWithNewModel[2],
      addedAnnotationsCount: 0,
      deletedAnnotationsCount: 3,
      resizedSmallerAnnotationsCount: 0,
      resizedBiggerAnnotationsCount: 0,
      modifiedAnnotationsCount: 0,
    },
    {
      ...treatmentsWithNewModel[3],
      addedAnnotationsCount: 2,
      deletedAnnotationsCount: 4,
      resizedSmallerAnnotationsCount: 4,
      resizedBiggerAnnotationsCount: 4,
      modifiedAnnotationsCount: 4,
    },
  ];

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    const treatmentRepository = buildTreatmentRepository();
    await Promise.all(
      (statisticsWithOldModel as any as statisticType[]).map(
        statisticRepository.insert,
      ),
    );
    await Promise.all(
      (treatmentsWithOldModel as any as treatmentType[]).map(
        treatmentRepository.insert,
      ),
    );

    await up();

    const statisticsAfterUpdateModel = await statisticRepository.findAll();
    expect(statisticsAfterUpdateModel.sort()).toEqual(
      statisticsWithNewModel.sort(),
    );
    const treatmentsAfterUpdateModel = await treatmentRepository.findAll();
    expect(treatmentsAfterUpdateModel.sort()).toEqual(
      treatmentsWithNewModel.sort(),
    );
  });

  it('should test down', async () => {
    const statisticRepository = buildStatisticRepository();
    await Promise.all(statisticsWithNewModel.map(statisticRepository.insert));
    const treatmentRepository = buildTreatmentRepository();
    await Promise.all(treatmentsWithNewModel.map(treatmentRepository.insert));

    await down();

    const statisticsAfterUpdateModel = await statisticRepository.findAll();
    expect(statisticsAfterUpdateModel.sort()).toEqual(
      statisticsWithOldModel.sort(),
    );
    const treatmentsAfterUpdateModel = await treatmentRepository.findAll();
    expect(treatmentsAfterUpdateModel.sort()).toEqual(
      treatmentsWithOldModel.sort(),
    );
  });
});
