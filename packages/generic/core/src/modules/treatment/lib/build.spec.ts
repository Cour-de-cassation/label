import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { build } from './build';

describe('build', () => {
  it('should build a new treatment with the appropriate fields', () => {
    const treatmentFields = {
      annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
        [
          { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
          { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
          { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
        ].map(annotationModule.generator.generate),
        [
          { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
          { start: 20, text: 'Editions Dupuis', category: 'personneMorale' },
          { start: 90, text: 'Gaston', category: 'personnePhysiquePrenom' },
        ].map(annotationModule.generator.generate),
      ),
      documentId: idModule.lib.buildId(),
      order: 3,
      source: 'annotator' as const,
    };

    const treatment = build(treatmentFields);

    expect(treatment).toEqual({
      _id: treatment._id,
      addedAnnotationsCount: 1,
      annotationsDiff: treatmentFields.annotationsDiff,
      deletedAnnotationsCount: 1,
      documentId: treatmentFields.documentId,
      duration: 0,
      lastUpdateDate: treatment.lastUpdateDate,
      modifiedAnnotationsCount: 1,
      order: treatmentFields.order,
      resizedBiggerAnnotationsCount: 1,
      resizedSmallerAnnotationsCount: 0,
      source: treatmentFields.source,
    });
  });
});
