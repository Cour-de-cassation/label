import { statisticGenerator } from '../generator';
import { aggregate } from './aggregate';

describe('aggregate', () => {
  it('should aggregate statistics per assignation', () => {
    const statistics = [
      {
        addedAnnotationsCount: { sensitive: 3, other: 1 },
        deletedAnnotationsCount: { anonymised: 3, other: 1 },
        documentNumber: 0,
        linkedEntitiesCount: 3,
        modifiedAnnotationsCount: { nonAnonymisedToSensitive: 0, anonymisedToNonAnonymised: 0, other: 3 },
        resizedBiggerAnnotationsCount: { sensitive: 3, other: 0 },
        resizedSmallerAnnotationsCount: { anonymised: 3, other: 0 },
        treatmentDuration: 3,
      },
      {
        addedAnnotationsCount: { sensitive: 1, other: 6 },
        deletedAnnotationsCount: { anonymised: 6, other: 2 },
        documentNumber: 1,
        linkedEntitiesCount: 4,
        modifiedAnnotationsCount: { nonAnonymisedToSensitive: 0, anonymisedToNonAnonymised: 0, other: 4 },
        resizedBiggerAnnotationsCount: { sensitive: 4, other: 0 },
        resizedSmallerAnnotationsCount: { anonymised: 4, other: 0 },
        treatmentDuration: 4,
      },
    ].map(statisticGenerator.generate);

    const aggregatedStatistics = aggregate(statistics);

    expect(aggregatedStatistics.perAssignation).toEqual({
      cumulatedValue: {
        subAnnotationsNonSensitiveCount: 7,
        subAnnotationsSensitiveCount: 11,
        surAnnotationsCount: 16,
        treatmentDuration: 7,
      },
      total: 2,
    });
  });

  it('should aggregate statistics per document', () => {
    const statistics = [
      {
        annotationsCount: 5,
        documentNumber: 0,
        wordsCount: 5,
      },
      {
        annotationsCount: 9,
        documentNumber: 1,
        wordsCount: 9,
      },
    ].map(statisticGenerator.generate);

    const aggregatedStatistics = aggregate(statistics);

    expect(aggregatedStatistics.perDocument).toEqual({
      cumulatedValue: {
        annotationsCount: 14,
        wordsCount: 14,
      },
      total: 2,
    });
  });
});
