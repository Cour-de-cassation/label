import { idModule } from '../../id';
import { ressourceFilterModule } from '../../ressourceFilter';
import { statisticGenerator } from '../generator';
import { aggregate } from './aggregate';

describe('aggregate', () => {
  const userId1 = idModule.lib.buildId();
  const userId2 = idModule.lib.buildId();

  const statistics = [
    {
      annotationsCount: 10,
      documentNumber: 0,
      linkedEntitiesCount: 3,
      subAnnotationsSensitiveCount: 5,
      subAnnotationsNonSensitiveCount: 6,
      surAnnotationsCount: 7,
      treatmentsSummary: [
        { userId: userId1, treatmentDuration: 15 },
        { userId: userId2, treatmentDuration: 12 },
      ],
      wordsCount: 1,
    },
    {
      annotationsCount: 12,
      documentNumber: 1,
      linkedEntitiesCount: 4,
      subAnnotationsSensitiveCount: 8,
      subAnnotationsNonSensitiveCount: 9,
      surAnnotationsCount: 10,
      treatmentsSummary: [
        { userId: userId1, treatmentDuration: 17 },
        { userId: userId2, treatmentDuration: 50 },
      ],
      wordsCount: 2,
    },
  ].map(statisticGenerator.generate);

  it('should aggregate statistics', () => {
    const aggregatedStatistics = aggregate(statistics, ressourceFilterModule.generator.generate());

    expect(aggregatedStatistics).toEqual({
      cumulatedValue: {
        annotationsCount: 22,
        subAnnotationsNonSensitiveCount: 15,
        subAnnotationsSensitiveCount: 13,
        surAnnotationsCount: 17,
        treatmentDuration: 94,
        wordsCount: 3,
      },
      total: 2,
    });
  });

  it('should aggregate statistics for user', () => {
    const aggregatedStatistics = aggregate(statistics, ressourceFilterModule.generator.generate({ userId: userId1 }));

    expect(aggregatedStatistics).toEqual({
      cumulatedValue: {
        annotationsCount: 22,
        subAnnotationsNonSensitiveCount: 15,
        subAnnotationsSensitiveCount: 13,
        surAnnotationsCount: 17,
        treatmentDuration: 32,
        wordsCount: 3,
      },
      total: 2,
    });
  });
});
