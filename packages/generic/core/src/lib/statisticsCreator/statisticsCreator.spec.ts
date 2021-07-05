import { annotationModule } from '../../modules/annotation';
import { assignationModule } from '../../modules/assignation';
import { annotationsDiffModule } from '../../modules/annotationsDiff';
import { documentModule } from '../../modules/document';
import { idModule } from '../../modules/id';
import { settingsModule } from '../../modules/settings';
import { treatmentModule } from '../../modules/treatment';
import { statisticsCreator } from './statisticsCreator';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);

describe('statisticsCreator', () => {
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
  });

  describe('buildFromDocument', () => {
    it('should build all the statistics of the given documents', () => {
      const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
      const documentPublicationCategory = ['P'];
      const documentSource = 'SOURCE';
      const duration = 1500;
      const userId = idModule.lib.buildId();
      const document = documentModule.generator.generate({
        externalId: documentExternalId,
        publicationCategory: documentPublicationCategory,
        source: documentSource,
        text: 'Some text with five words',
      });
      const treatments = [
        {
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            [
              { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
              { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
              { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
            ].map(annotationModule.generator.generate),
          ),
          documentId: document._id,
          order: 0,
          lastUpdateDate: TREATMENT_DATE.getTime(),
        },
        {
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
          documentId: document._id,
          duration,
          order: 1,
          lastUpdateDate: TREATMENT_DATE.getTime(),
        },
      ].map(treatmentModule.generator.generate);
      const assignation = assignationModule.generator.generate({
        documentId: document._id,
        treatmentId: treatments[1]._id,
        userId,
      });

      const statistics = statisticsCreator.buildFromDocument({
        assignations: [assignation],
        document,
        settings,
        treatments: treatments,
      });

      expect(statistics[0]).toEqual({
        _id: statistics[0]._id,
        addedAnnotationsCount: { sensitive: 1, other: 0 },
        annotationsCount: 3,
        deletedAnnotationsCount: { anonymised: 1, other: 0 },
        documentExternalId,
        linkedEntitiesCount: 0,
        modifiedAnnotationsCount: 1,
        publicationCategory: documentPublicationCategory,
        resizedBiggerAnnotationsCount: 1,
        resizedSmallerAnnotationsCount: 0,
        source: documentSource,
        treatmentDate: TREATMENT_DATE.getTime(),
        treatmentDuration: duration,
        userId,
        wordsCount: 5,
      });
    });
  });
});
