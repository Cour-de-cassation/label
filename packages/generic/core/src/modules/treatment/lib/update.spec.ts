import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { settingsModule } from '../../settings';
import { treatmentGenerator } from '../generator';
import { update } from './update';

describe('update', () => {
  it('should return a new treatment with the updated fields', () => {
    const treatment = treatmentGenerator.generate();
    const settings = settingsModule.lib.buildSettings({
      personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
      personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
      personneMorale: { isSensitive: false, isAnonymized: false },
    });
    const treatmentFields = {
      annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
        [
          { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
          { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
          { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
          { start: 100, text: 'truc', category: 'personnePhysiquePrenom' },
          { start: 120, text: 'machin', category: 'personneMorale' },
        ].map(annotationModule.generator.generate),
        [
          { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
          { start: 10, text: 'et', category: 'personnePhysiquePrenom' },
          { start: 20, text: 'Editions Dupuis', category: 'personneMorale' },
          { start: 90, text: 'Gaston', category: 'personnePhysiquePrenom' },
        ].map(annotationModule.generator.generate),
      ),
    };

    const updatedTreatment = update(treatment, treatmentFields, settings);

    expect(updatedTreatment).toEqual({
      ...treatment,
      ...treatmentFields,
      _id: treatment._id,
      lastUpdateDate: updatedTreatment.lastUpdateDate,
      subAnnotationsNonSensitiveCount: 1,
      surAnnotationsCount: 3,
      subAnnotationsSensitiveCount: 1,
    });
  });
});
