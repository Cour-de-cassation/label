import {
  idModule,
  ressourceFilterModule,
  statisticModule,
  settingsModule,
} from '@label/core';
import { buildStatisticRepository } from '../repository';
import { fetchFilteredStatistics } from './fetchFilteredStatistics';

describe('fetchFilteredStatistics', () => {
  const statisticRepository = buildStatisticRepository();
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
  });

  describe('statistics', () => {
    it('should fetch all the statistics according to filter', async () => {
      const id1 = idModule.lib.buildId();
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const ressourceFilter = ressourceFilterModule.generator.generate({
        userId: userId1,
      });
      const statistics = [
        {
          _id: id1,
          subAnnotationsSensitiveCount: 6,
          subAnnotationsNonSensitiveCount: 1,
          surAnnotationsCount: 6,
          annotationsCount: 9,
          linkedEntitiesCount: 3,
          treatmentsSummary: [
            { userId: userId1, treatmentDuration: 3 },
            { userId: userId2, treatmentDuration: 10 },
          ],
          wordsCount: 9,
        },
        {
          subAnnotationsSensitiveCount: 6,
          subAnnotationsNonSensitiveCount: 1,
          surAnnotationsCount: 6,
          annotationsCount: 9,
          linkedEntitiesCount: 3,
          treatmentDuration: 3,
          treatmentsSummary: [{ userId: userId2, treatmentDuration: 50 }],
          wordsCount: 9,
        },
      ].map(statisticModule.generator.generate);
      await Promise.all(statistics.map(statisticRepository.insert));

      const aggregatedStatistics = await fetchFilteredStatistics(
        ressourceFilter,
        settings,
      );

      expect(aggregatedStatistics.length).toEqual(1);
      expect(aggregatedStatistics[0]._id).toEqual(id1);
    });
  });
});
