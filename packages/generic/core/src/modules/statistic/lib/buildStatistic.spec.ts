import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { assignationModule } from '../../assignation';
import { documentModule } from '../../document';
import { idModule } from '../../id';
import { settingsModule } from '../../settings';
import { treatmentModule } from '../../treatment';
import { buildStatistic } from './buildStatistic';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);

describe('buildStatistic', () => {
  it('should build a new statistic', () => {
    const annotationsCount = 10;
    const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
    const documentPublicationCategory = ['P'];
    const documentSource = 'SOURCE';
    const duration = 1500;
    const linkedEntitiesCount = 2;
    const userId = idModule.lib.buildId();
    const settings = settingsModule.lib.buildSettings({
      personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
      personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
      personneMorale: { isSensitive: false, isAnonymized: false },
    });
    const document = documentModule.generator.generate({
      externalId: documentExternalId,
      publicationCategory: documentPublicationCategory,
      source: documentSource,
      text: 'Some text with five words',
    });
    const treatment = treatmentModule.generator.generate({
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
      documentId: document._id,
      duration,
      lastUpdateDate: TREATMENT_DATE.getTime(),
    });
    const assignation = assignationModule.generator.generate({
      documentId: document._id,
      treatmentId: treatment._id,
      userId,
    });

    const statistic = buildStatistic({
      annotationsCount,
      assignation,
      document,
      linkedEntitiesCount,
      settings,
      treatment,
    });

    expect(statistic).toEqual({
      _id: statistic._id,
      addedAnnotationsCount: { sensitive: 1, other: 1 },
      annotationsCount,
      deletedAnnotationsCount: { anonymised: 2, other: 1 },
      documentExternalId,
      linkedEntitiesCount,
      modifiedAnnotationsCount: { nonAnonymisedToSensitive: 0, anonymisedToNonAnonymised: 0, other: 1 },
      publicationCategory: documentPublicationCategory,
      resizedBiggerAnnotationsCount: { sensitive: 0, other: 1 },
      resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
      source: documentSource,
      treatmentDate: TREATMENT_DATE.getTime(),
      treatmentDuration: duration,
      userId,
      wordsCount: 5,
    });
  });
});
