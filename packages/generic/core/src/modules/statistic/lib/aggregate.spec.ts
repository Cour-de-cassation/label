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
        modifiedAnnotationsCount: 3,
        resizedBiggerAnnotationsCount: 3,
        resizedSmallerAnnotationsCount: 3,
        treatmentDuration: 3,
      },
      {
        addedAnnotationsCount: { sensitive: 1, other: 6 },
        deletedAnnotationsCount: { anonymised: 6, other: 2 },
        documentNumber: 1,
        linkedEntitiesCount: 4,
        modifiedAnnotationsCount: 4,
        resizedBiggerAnnotationsCount: 4,
        resizedSmallerAnnotationsCount: 4,
        treatmentDuration: 4,
      },
    ].map(statisticGenerator.generate);

    const aggregatedStatistics = aggregate(statistics);

    expect(aggregatedStatistics.perAssignation).toEqual({
      cumulatedValue: {
        addedAnnotationsCount: { sensitive: 4, other: 7 },
        deletedAnnotationsCount: { anonymised: 9, other: 3 },
        linkedEntitiesCount: 7,
        modifiedAnnotationsCount: 7,
        resizedBiggerAnnotationsCount: 7,
        resizedSmallerAnnotationsCount: 7,
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
