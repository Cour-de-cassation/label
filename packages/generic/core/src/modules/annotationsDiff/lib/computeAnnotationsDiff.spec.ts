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

  it('should compute the annotations diff between after an association', () => {
    const annotation1 = annotationModule.generator.generate();
    const annotation2 = annotationModule.generator.generate();
    const annotation1Linked = annotationModule.lib.annotationLinker.link(annotation1, annotation2);
    const annotations1 = [annotation1, annotation2];
    const annotations2 = [annotation1Linked, annotation2];

    const annotationsDiff = computeAnnotationsDiff(annotations1, annotations2);

    expect(annotationsDiff).toEqual(buildAnnotationsDiff([annotation1], [annotation1Linked]));
  });
});
