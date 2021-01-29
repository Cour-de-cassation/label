import { annotationModule } from '../../annotation';
import { buildAnnotationsDiff } from './buildAnnotationsDiff';
import { computeAnnotationsDiff } from './computeAnnotationsDiff';

describe('computeAnnotationsDiff', () => {
  it('should compute the annotations diff between two set of annotations', () => {
    const annotations = [{}, {}, {}, {}, {}].map(annotationModule.generator.generate);
    const annotations1 = [annotations[0], annotations[1], annotations[2]];
    const annotations2 = [annotations[3], annotations[4], annotations[1]];

    const annotationsDiff = computeAnnotationsDiff(annotations1, annotations2);

    expect(annotationsDiff).toEqual(
      buildAnnotationsDiff([annotations[0], annotations[2]], [annotations[3], annotations[4]]),
    );
  });
});
