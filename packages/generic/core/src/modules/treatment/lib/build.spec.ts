import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { settingsModule } from '../../settings';
import { build } from './build';

describe('build', () => {
  it('should build a new treatment with the appropriate fields', () => {
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
      documentId: idModule.lib.buildId(),
      order: 3,
      source: 'annotator' as const,
    };

    const treatment = build(treatmentFields, settings);

    expect(treatment).toEqual({
      _id: treatment._id,
      subAnnotationsNonSensitiveCount: 1,
      surAnnotationsCount: 3,
      subAnnotationsSensitiveCount: 1,
      annotationsDiff: treatmentFields.annotationsDiff,
      documentId: treatmentFields.documentId,
      duration: 0,
      lastUpdateDate: treatment.lastUpdateDate,
      order: treatmentFields.order,
      source: treatmentFields.source,
    });
  });
});
