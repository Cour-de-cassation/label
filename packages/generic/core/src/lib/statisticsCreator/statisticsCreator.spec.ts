import {
  annotationModule,
  annotationsDiffModule,
  assignationModule,
  documentModule,
  idModule,
  treatmentModule,
} from '../../modules';
import { statisticsCreator } from './statisticsCreator';

describe('statisticsCreator', () => {
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
            ].map(annotationModule.generator.generate),
          ),
          documentId: document._id,
          order: 0,
        },
        {
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
          documentId: document._id,
          duration,
          order: 1,
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
        treatments: treatments,
      });

      expect(statistics[0]).toEqual({
        _id: statistics[0]._id,
        addedAnnotationsCount: 1,
        annotationsCount: 2,
        deletedAnnotationsCount: 1,
        documentExternalId,
        linkedEntitiesCount: 0,
        modifiedAnnotationsCount: 1,
        publicationCategory: documentPublicationCategory,
        resizedBiggerAnnotationsCount: 1,
        resizedSmallerAnnotationsCount: 0,
        source: documentSource,
        treatmentDuration: duration,
        userId,
        wordsCount: 5,
      });
    });
  });
});
