import { omit } from 'lodash';
import { statisticModule, statisticType } from '@label/core';
import { buildStatisticRepository } from '../../../modules/statistic';
import { addTreatmentDateInStatisticModel } from './addTreatmentDateInStatisticModel';

const MIGRATION_DATE = new Date(2021, 3, 30, 0, 0, 0);

describe('addTreatmentDateInStatisticModel', () => {
  it('should add a fix treatmentDate value in the statistic data model in the database', async () => {
    const statisticRepository = buildStatisticRepository();
    const statistics = [
      statisticModule.generator.generate({
        treatmentDate: MIGRATION_DATE.getTime(),
      }),
      statisticModule.generator.generate({
        treatmentDate: MIGRATION_DATE.getTime(),
      }),
      statisticModule.generator.generate({
        treatmentDate: MIGRATION_DATE.getTime(),
      }),
    ];
    const statisticsWithOldModel = statistics.map((statistic) =>
      omit(statistic, ['treatmentDate']),
    );
    await Promise.all(
      ((statisticsWithOldModel as any) as statisticType[]).map(
        statisticRepository.insert,
      ),
    );

    await addTreatmentDateInStatisticModel();

    const statisticsAfterUpdateModel = await statisticRepository.findAll();
    expect(statisticsAfterUpdateModel.sort()).toEqual(statistics.sort());
  });
});
