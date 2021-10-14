import { statisticModule, statisticType } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/27_6168561c62c6bf3551b1d013';
import { omit } from 'lodash';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add statisticNumber and decisionDate in statistic model', () => {
  const statisticsWithNewModel = [
    statisticModule.generator.generate({
      appealNumber: undefined,
    }),
    statisticModule.generator.generate({
      appealNumber: undefined,
    }),
    statisticModule.generator.generate({
      appealNumber: undefined,
    }),
  ];
  const statisticsWithOldModel = [
    omit(statisticsWithNewModel[0], ['appealNumber']),
    omit(statisticsWithNewModel[1], ['appealNumber']),
    omit(statisticsWithNewModel[2], ['appealNumber']),
  ];

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insertMany(
      (statisticsWithOldModel as any) as statisticType[],
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
