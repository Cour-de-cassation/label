import { omit } from 'lodash';
import { idModule, statisticModule, statisticType } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/9_610162cc5deb0c4f93eddf4d';

describe('add treatmentsSummary and remove treatmentDuration and userId in statistic model', () => {
  const [userId1, userId2, userId3] = [undefined, undefined, undefined].map(
    idModule.lib.buildId,
  );
  const statisticsWithNewModel = [
    statisticModule.generator.generate({
      documentExternalId: 'ID1',
      treatmentsSummary: [{ userId: userId1, treatmentDuration: 10 }],
    }),
    statisticModule.generator.generate({
      documentExternalId: 'ID2',
      treatmentsSummary: [
        { userId: userId2, treatmentDuration: 20 },
        { userId: userId3, treatmentDuration: 30 },
      ],
    }),
  ];
  const statisticsWithOldModel = [
    omit(
      { ...statisticsWithNewModel[0], userId: userId1, treatmentDuration: 10 },
      'treatmentsSummary',
    ),
    omit(
      { ...statisticsWithNewModel[1], userId: userId2, treatmentDuration: 20 },
      'treatmentsSummary',
    ),
    omit(
      { ...statisticsWithNewModel[1], userId: userId3, treatmentDuration: 30 },
      'treatmentsSummary',
    ),
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
    expect(statisticsAfterUpdateModel.length).toBe(2);
    expect(statisticsWithNewModel.length).toBe(2);
    expect(
      statisticsAfterUpdateModel
        .map((statistic) => omit(statistic, '_id'))
        .sort(),
    ).toEqual(
      statisticsWithNewModel.map((statistic) => omit(statistic, '_id')).sort(),
    );
  });

  it('should test down', async () => {
    const statisticRepository = buildStatisticRepository();
    await Promise.all(statisticsWithNewModel.map(statisticRepository.insert));

    await down();

    const statisticsAfterUpdateModel = await statisticRepository.findAll();
    expect(
      statisticsAfterUpdateModel
        .map((statistic) => omit(statistic, '_id'))
        .sort(),
    ).toEqual(
      statisticsWithOldModel.map((statistic) => omit(statistic, '_id')).sort(),
    );
  });
});
