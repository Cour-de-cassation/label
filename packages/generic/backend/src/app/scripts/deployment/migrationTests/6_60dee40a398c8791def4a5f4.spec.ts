import { statisticModule, statisticType } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/6_60dee40a398c8791def4a5f4';

describe('replace addedAnnotationsCount and deletedAnnotationsCount in statistic', () => {
  const statisticsWithNewModel = [
    statisticModule.generator.generate({}),
    statisticModule.generator.generate({
      addedAnnotationsCount: { sensitive: 0, other: 3 },
    }),
    statisticModule.generator.generate({
      deletedAnnotationsCount: { anonymised: 0, other: 3 },
    }),
    statisticModule.generator.generate({
      addedAnnotationsCount: { sensitive: 0, other: 2 },
      deletedAnnotationsCount: { anonymised: 0, other: 4 },
    }),
  ];
  const statisticsWithOldModel = [
    {
      ...statisticsWithNewModel[0],
      addedAnnotationsCount: 0,
      deletedAnnotationsCount: 0,
    },
    {
      ...statisticsWithNewModel[1],
      addedAnnotationsCount: 3,
      deletedAnnotationsCount: 0,
    },
    {
      ...statisticsWithNewModel[2],
      addedAnnotationsCount: 0,
      deletedAnnotationsCount: 3,
    },
    {
      ...statisticsWithNewModel[3],
      addedAnnotationsCount: 2,
      deletedAnnotationsCount: 4,
    },
  ];

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    await Promise.all(
      ((statisticsWithOldModel as any) as statisticType[]).map(
        statisticRepository.insert,
      ),
    );

    await up();

    const statisticsAfterUpdateModel = await statisticRepository.findAll();
    expect(statisticsAfterUpdateModel.sort()).toEqual(
      statisticsWithNewModel.sort(),
    );
  });

  it('should test down', async () => {
    const statisticRepository = buildStatisticRepository();
    await Promise.all(statisticsWithNewModel.map(statisticRepository.insert));

    await down();

    const statisticsAfterUpdateModel = await statisticRepository.findAll();
    expect(statisticsAfterUpdateModel.sort()).toEqual(
      statisticsWithOldModel.sort(),
    );
  });
});
