import { statisticModule, idModule } from '@label/core';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/24_616447e577a53486caf3de54';
import { omit } from 'lodash';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add session and chamberName to statistic', () => {
  const statisticsWithOldModelForUp = [
    {
      jurisdiction: 'Cour de cassation',
    },
    {
      jurisdiction: undefined,
    },
  ]
    .map(statisticModule.generator.generate)
    .map((statistic) => omit(statistic, ['session', 'chamberName']));
  const statisticsWithNewModelForUp = [
    {
      ...statisticsWithOldModelForUp[0],
      session: undefined,
      chamberName: undefined,
      jurisdiction: 'cour de cassation',
    },
    {
      ...statisticsWithOldModelForUp[1],
      session: undefined,
      chamberName: undefined,
      jurisdiction: undefined,
    },
  ];

  const statisticsWithNewModelForDown = [
    {
      session: 'FRH',
      jurisdiction: 'cour de cassation',
      chamberName: 'Chambre criminelle',
    },
    {
      session: undefined,
      jurisdiction: undefined,
      chamberName: undefined,
    },
  ].map(statisticModule.generator.generate);
  const statisticsWithOldModelForDown = [
    {
      ...omit(statisticsWithNewModelForDown[0], ['session', 'chamberName']),
      jurisdiction: 'cour de cassation',
    },
    omit(statisticsWithNewModelForDown[1], ['session', 'chamberName']),
  ];

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insertMany(statisticsWithOldModelForUp as any[]);

    await up();

    const statisticsAfterUpdateModel = await statisticRepository.findAllByIds();
    statisticsWithOldModelForUp.forEach(({ _id }) =>
      expect(
        statisticsAfterUpdateModel[idModule.lib.convertToString(_id)],
      ).toEqual(
        statisticsWithNewModelForUp.find((statistic) =>
          idModule.lib.equalId(statistic._id, _id),
        ),
      ),
    );
  });

  it('should test down', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insertMany(statisticsWithNewModelForDown);
    await down();

    const statisticsAfterUpdateModel = await statisticRepository.findAllByIds();
    statisticsWithNewModelForDown.forEach(({ _id }) =>
      expect(
        statisticsAfterUpdateModel[idModule.lib.convertToString(_id)],
      ).toEqual(
        statisticsWithOldModelForDown.find((statistic) =>
          idModule.lib.equalId(statistic._id, _id),
        ),
      ),
    );
  });
});
