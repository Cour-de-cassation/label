import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { treatmentGenerator } from '../generator';
import { sortInConsistentOrder } from './sortInConsistentOrder';

describe('sortInConsistentOrder', () => {
  const annotations = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }].map(
    annotationModule.generator.generate,
  );
  const documentId = idModule.lib.buildId();

  it('should sort the treatments in a consistent order', () => {
    const treatments = [
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [annotations[1]],
          after: [annotations[3], annotations[4]],
        }),
        documentId,
        order: 2,
      },
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [],
          after: [annotations[0], annotations[1]],
        }),
        documentId,
        order: 0,
      },
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [annotations[0]],
          after: [annotations[2]],
        }),
        documentId,
        order: 1,
      },
    ].map(treatmentGenerator.generate);

    const sortedTreatments = sortInConsistentOrder(treatments);

    expect(sortedTreatments).toEqual([treatments[1], treatments[2], treatments[0]]);
  });
});
