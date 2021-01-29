import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { applyToAnnotations } from './applyToAnnotations';

describe('applyToAnnotations', () => {
  it('should compute the annotations after the application of the diff', () => {
    const annotations = [{}, {}, {}, {}].map(annotationModule.generator.generate);
    const newAnnotation = annotationModule.generator.generate();
    const annotationsDiff = annotationsDiffGenerator.generate({
      before: [annotations[0], annotations[3]],
      after: [newAnnotation],
    });

    const newAnnotations = applyToAnnotations(annotations, annotationsDiff);

    expect(newAnnotations).toEqual(
      annotationModule.lib.sortAnnotations([annotations[1], annotations[2], newAnnotation]),
    );
  });
});
