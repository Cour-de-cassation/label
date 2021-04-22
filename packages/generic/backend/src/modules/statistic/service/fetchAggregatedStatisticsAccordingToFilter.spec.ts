import {
  annotationModule,
  annotationsDiffModule,
  documentModule,
  idModule,
  ressourceFilterModule,
  statisticModule,
  treatmentModule,
  assignationModule,
} from '@label/core';
import { buildAssignationRepository } from '../../assignation';
import { buildDocumentRepository } from '../../document';
import { buildTreatmentRepository } from '../../treatment';
import { buildStatisticRepository } from '../repository';
import { fetchAggregatedStatisticsAccordingToFilter } from './fetchAggregatedStatisticsAccordingToFilter';

describe('fetchAggregatedStatisticsAccordingToFilter', () => {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();

  describe('statistics', () => {
    it('should fetch all the statistics according to filter', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const ressourceFilter = ressourceFilterModule.generator.generate({
        userId: userId1,
      });
      const statistics = [
        {
          addedAnnotationsCount: 3,
          annotationsCount: 9,
          deletedAnnotationsCount: 3,
          documentExternalId: 'DOCUMENT_EXTERNAL_ID_0',
          linkedEntitiesCount: 3,
          modifiedAnnotationsCount: 3,
          resizedBiggerAnnotationsCount: 3,
          resizedSmallerAnnotationsCount: 3,
          treatmentDuration: 3,
          userId: userId1,
          wordsCount: 9,
        },
        { userId: userId2 },
        {
          addedAnnotationsCount: 4,
          annotationsCount: 9,
          deletedAnnotationsCount: 4,
          documentExternalId: 'DOCUMENT_EXTERNAL_ID_0',
          linkedEntitiesCount: 4,
          modifiedAnnotationsCount: 4,
          resizedBiggerAnnotationsCount: 4,
          resizedSmallerAnnotationsCount: 4,
          treatmentDuration: 4,
          userId: userId1,
          wordsCount: 9,
        },
      ].map(statisticModule.generator.generate);
      await Promise.all(statistics.map(statisticRepository.insert));

      const aggregatedStatistics = await fetchAggregatedStatisticsAccordingToFilter(
        ressourceFilter,
      );

      expect(aggregatedStatistics).toEqual({
        perAssignation: {
          cumulatedValue: {
            addedAnnotationsCount: 7,
            deletedAnnotationsCount: 7,
            linkedEntitiesCount: 7,
            modifiedAnnotationsCount: 7,
            resizedBiggerAnnotationsCount: 7,
            resizedSmallerAnnotationsCount: 7,
            treatmentDuration: 7,
          },
          total: 2,
        },
        perDocument: {
          cumulatedValue: {
            annotationsCount: 9,
            wordsCount: 9,
          },
          total: 1,
        },
      });
    });
  });

  describe('done documents', () => {
    it('should fetch all the statistics from the done documents according to filter', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const ressourceFilter = ressourceFilterModule.generator.generate({
        source: 'SOURCE1',
        userId: userId1,
      });
      const documents = ([
        {
          source: 'SOURCE1',
          status: 'done',
          text: 'Some text with five words',
        },
        { status: 'done' },
        { status: 'saved' },
      ] as const).map(documentModule.generator.generate);
      const treatments = [
        {
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            [
              { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
              { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
            ].map(annotationModule.generator.generate),
          ),
          documentId: documents[0]._id,
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
              {
                start: 20,
                text: 'Editions Dupuis',
                category: 'personneMorale',
              },
            ].map(annotationModule.generator.generate),
          ),
          documentId: documents[0]._id,
          duration: 10,
          order: 1,
        },
        { documentId: documents[1]._id },
      ].map(treatmentModule.generator.generate);
      const assignations = [
        {
          documentId: documents[0]._id,
          treatmentId: treatments[1]._id,
          userId: userId1,
        },
        {
          documentId: documents[1]._id,
          treatmentId: treatments[2]._id,
          userId: userId2,
        },
      ].map(assignationModule.generator.generate);
      await Promise.all(assignations.map(assignationRepository.insert));
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(treatments.map(treatmentRepository.insert));

      const aggregatedStatistics = await fetchAggregatedStatisticsAccordingToFilter(
        ressourceFilter,
      );

      expect(aggregatedStatistics).toEqual({
        perAssignation: {
          cumulatedValue: {
            addedAnnotationsCount: 1,
            deletedAnnotationsCount: 1,
            linkedEntitiesCount: 0,
            modifiedAnnotationsCount: 1,
            resizedBiggerAnnotationsCount: 1,
            resizedSmallerAnnotationsCount: 0,
            treatmentDuration: 10,
          },
          total: 1,
        },
        perDocument: {
          cumulatedValue: {
            annotationsCount: 2,
            wordsCount: 5,
          },
          total: 1,
        },
      });
    });
  });
});
