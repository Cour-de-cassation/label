import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
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

    expect(annotationsDiff.before).toEqual([]);
    expect(annotationsDiff.after).toEqual(
      annotationModule.lib.sortAnnotations([annotations[2], annotations[3], annotations[4]]),
    );
  });

  it('should squash the given annotationsDiffs (none initialy empty case)', () => {
    const annotations = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }, { text: '5' }].map(
      annotationModule.generator.generate,
    );
    const annotationsDiffs = [
      { before: [annotations[5]], after: [annotations[0], annotations[1]] },
      { before: [annotations[0]], after: [annotations[2]] },
      { before: [annotations[1]], after: [annotations[3], annotations[4]] },
    ].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff.before.sort()).toEqual([annotations[5]]);
    expect(annotationsDiff.after.sort()).toEqual(
      annotationModule.lib.sortAnnotations([annotations[2], annotations[3], annotations[4]]),
    );
  });

  it('should work with no annotationDiff', () => {
    const annotationsDiffs = [].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff).toEqual({ before: [], after: [] });
  });
});
