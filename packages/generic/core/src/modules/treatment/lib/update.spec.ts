import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { treatmentGenerator } from '../generator';
import { update } from './update';

describe('update', () => {
  it('should return a new treatment with the updated fields', () => {
    const treatment = treatmentGenerator.generate();
    const treatmentFields = {
      annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
        [
          { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
          { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
        ].map(annotationModule.generator.generate),
        [
          { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
          { start: 20, text: 'Editions Dupuis', category: 'personneMorale' },
        ].map(annotationModule.generator.generate),
      ),
    };

    const updatedTreatment = update(treatment, treatmentFields);

    expect(updatedTreatment).toEqual({
      ...treatment,
      ...treatmentFields,
      _id: treatment._id,
      addedAnnotationsCount: 1,
      deletedAnnotationsCount: 1,
      lastUpdateDate: updatedTreatment.lastUpdateDate,
      modifiedAnnotationsCount: 1,
      resizedBiggerAnnotationsCount: 1,
      resizedSmallerAnnotationsCount: 0,
    });
  });
});
