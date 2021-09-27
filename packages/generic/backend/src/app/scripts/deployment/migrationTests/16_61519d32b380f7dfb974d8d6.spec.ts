import { statisticModule } from '@label/core';
import { omit } from 'lodash';
import { buildStatisticRepository } from '../../../../modules/statistic';
import { up, down } from '../migrations/16_61519d32b380f7dfb974d8d6';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add jurisdiction to statistic', () => {
  const statisticWithOldModel = omit(statisticModule.generator.generate({}), [
    'jurisdiction',
  ]);
  const statisticWithNewModel = statisticModule.generator.generate({
    ...statisticWithOldModel,
    jurisdiction: 'truc',
  });

  it('should test up', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insert(statisticWithOldModel as any);

    await up();

    const statisticAfterUpdateModel = await statisticRepository.findById(
      statisticWithOldModel._id,
    );
    expect(statisticAfterUpdateModel).toEqual({
      ...statisticWithNewModel,
      jurisdiction: undefined,
    });
  });

  it('should test down', async () => {
    const statisticRepository = buildStatisticRepository();
    await statisticRepository.insert(statisticWithNewModel);
    await down();

    const statisticAfterUpdateModel = await statisticRepository.findById(
      statisticWithNewModel._id,
    );
    expect(statisticAfterUpdateModel).toEqual(statisticWithOldModel);
  });
});
