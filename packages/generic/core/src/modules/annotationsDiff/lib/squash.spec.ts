import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { squash } from './squash';

describe('squash', () => {
  it('should squash the given annotationsDiffs', () => {
    const annotations = [{ start: 0 }, { start: 1 }, { start: 2 }, { start: 3 }, { start: 4 }].map(
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
    const annotations = [{ start: 0 }, { start: 1 }, { start: 2 }, { start: 3 }, { start: 4 }, { start: 5 }].map(
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

  it('should squash the given annotationsDiffs (with 4 annotations)', () => {
    const annotations = [{ start: 1 }, { start: 2 }, { start: 3 }, { start: 4 }].map(
      annotationModule.generator.generate,
    );
    const annotationsDiffs = [
      { before: [annotations[0]], after: [annotations[2]] },
      { before: [annotations[1]], after: [annotations[3]] },
    ].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff.before.sort()).toEqual([annotations[0], annotations[1]]);
    expect(annotationsDiff.after.sort()).toEqual(
      annotationModule.lib.sortAnnotations([annotations[2], annotations[3]]),
    );
  });

  it('should squash the given annotationsDiffs (with an annotation that is restored)', () => {
    const annotations = [{ start: 1 }, { start: 2 }].map(annotationModule.generator.generate);
    const annotationsDiffs = [
      { before: [], after: [annotations[0]] },
      { before: [annotations[0]], after: [] },
    ].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff.before).toEqual([]);
    expect(annotationsDiff.after).toEqual([]);
  });

  it('should work with no annotationDiff', () => {
    const annotationsDiffs = [].map(annotationsDiffGenerator.generate);

    const annotationsDiff = squash(annotationsDiffs);

    expect(annotationsDiff).toEqual({ before: [], after: [] });
  });
});
