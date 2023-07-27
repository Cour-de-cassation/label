import { omit } from 'lodash';
import { statisticModule, statisticType } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/21_615c46cfd48a8b5e395b8f16';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add statisticNumber and decisionDate in statistic model', () => {
  const statisticsWithNewModel = [
    statisticModule.generator.generate({
      documentNumber: 0,
      decisionDate: undefined,
    }),
    statisticModule.generator.generate({
      documentNumber: 0,
      decisionDate: undefined,
    }),
    statisticModule.generator.generate({
      documentNumber: 0,
      decisionDate: undefined,
    }),
  ];
  const statisticsWithOldModel = [
    omit(statisticsWithNewModel[0], ['documentNumber', 'decisionDate']),
    omit(statisticsWithNewModel[1], ['documentNumber', 'decisionDate']),
    omit(statisticsWithNewModel[2], ['documentNumber', 'decisionDate']),
  ];

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    await Promise.all(
      (statisticsWithOldModel as any as statisticType[]).map(
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
