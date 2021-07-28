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
      addedAnnotationsCount: { sensitive: 3, other: 1 },
      deletedAnnotationsCount: { anonymised: 3, other: 1 },
      documentNumber: 0,
      linkedEntitiesCount: 3,
      modifiedAnnotationsCount: { nonAnonymisedToSensitive: 0, anonymisedToNonAnonymised: 0, other: 3 },
      resizedBiggerAnnotationsCount: { sensitive: 3, other: 0 },
      resizedSmallerAnnotationsCount: { anonymised: 3, other: 0 },
      treatmentsSummary: [
        { userId: userId1, treatmentDuration: 15 },
        { userId: userId2, treatmentDuration: 12 },
      ],
      wordsCount: 1,
    },
    {
      annotationsCount: 12,
      addedAnnotationsCount: { sensitive: 1, other: 6 },
      deletedAnnotationsCount: { anonymised: 6, other: 2 },
      documentNumber: 1,
      linkedEntitiesCount: 4,
      modifiedAnnotationsCount: { nonAnonymisedToSensitive: 10, anonymisedToNonAnonymised: 0, other: 4 },
      resizedBiggerAnnotationsCount: { sensitive: 4, other: 0 },
      resizedSmallerAnnotationsCount: { anonymised: 4, other: 0 },
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
        subAnnotationsNonSensitiveCount: 7,
        subAnnotationsSensitiveCount: 21,
        surAnnotationsCount: 16,
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
        subAnnotationsNonSensitiveCount: 7,
        subAnnotationsSensitiveCount: 21,
        surAnnotationsCount: 16,
        treatmentDuration: 32,
        wordsCount: 3,
      },
      total: 2,
    });
  });
});
