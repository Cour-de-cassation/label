import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { buildAnnotationsDiff } from './buildAnnotationsDiff';
import { squash } from './squash';

describe('squash', () => {
  it('should squash the given annotationsDiffs', () => {
    const annotations = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }].map(
      annotationModule.generator.generate,
    );
    const annotationsDiffs = [
      { before: [], after: [annotations[0], annotations[1]] },
      { before: [annotations[0]], after: [annotations[2]] },
      { before: [annotations[1]], after: [annotations[3], annotations[4]] },
    ].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff).toEqual(buildAnnotationsDiff([], [annotations[2], annotations[3], annotations[4]]));
  });

  it('should work with no annotationDiff', () => {
    const annotationsDiffs = [].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff).toEqual({ before: [], after: [] });
  });
});
