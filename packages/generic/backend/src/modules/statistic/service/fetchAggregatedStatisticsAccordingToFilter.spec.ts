import {
  documentModule,
  idModule,
  ressourceFilterModule,
  statisticModule,
  treatmentModule,
  assignationModule,
  settingsModule,
  annotationsDiffModule,
  annotationModule,
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
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
  });

  describe('statistics', () => {
    it('should fetch all the statistics according to filter', async () => {
      const userId1 = idModule.lib.buildId();
      const userId2 = idModule.lib.buildId();
      const ressourceFilter = ressourceFilterModule.generator.generate({
        userId: userId1,
      });
      const statistics = [
        {
          subAnnotationsSensitiveCount: 6,
          subAnnotationsNonSensitiveCount: 1,
          surAnnotationsCount: 6,
          annotationsCount: 9,
          linkedEntitiesCount: 3,
          treatmentsSummary: [
            { userId: userId1, treatmentDuration: 3 },
            { userId: userId2, treatmentDuration: 10 },
          ],
          wordsCount: 9,
        },
        {
          subAnnotationsSensitiveCount: 6,
          subAnnotationsNonSensitiveCount: 1,
          surAnnotationsCount: 6,
          annotationsCount: 9,
          linkedEntitiesCount: 3,
          treatmentDuration: 3,
          treatmentsSummary: [{ userId: userId2, treatmentDuration: 50 }],
          wordsCount: 9,
        },
      ].map(statisticModule.generator.generate);
      await Promise.all(statistics.map(statisticRepository.insert));

      const aggregatedStatistics = await fetchAggregatedStatisticsAccordingToFilter(
        ressourceFilter,
        settings,
      );

      expect(aggregatedStatistics).toEqual({
        cumulatedValue: {
          subAnnotationsNonSensitiveCount: 1,
          subAnnotationsSensitiveCount: 6,
          surAnnotationsCount: 6,
          treatmentDuration: 3,
          annotationsCount: 9,
          wordsCount: 9,
        },
        total: 1,
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
          documentId: documents[0]._id,
          order: 0,
          duration: 0,
          source: 'NLPTagger' as const,
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            [
              { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
              { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
              { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
            ].map(annotationModule.generator.generate),
          ),
        },
        {
          documentId: documents[0]._id,
          order: 1,
          duration: 0,
          source: 'NLPPostProcess' as const,
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            []
          ),
        },
        {
          documentId: documents[0]._id,
          order: 2,
          duration: 0,
          source: 'NLP' as const,
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            [],
          ),
        },
        {
          documentId: documents[0]._id,
          source: 'postProcess' as const,
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [
              { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
              { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
              { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
            ].map(annotationModule.generator.generate),
            [
              { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
              {
                start: 20,
                text: 'Editions Dupuis',
                category: 'personneMorale',
              },
              { start: 90, text: 'Gaston', category: 'personnePhysiquePrenom' },
            ].map(annotationModule.generator.generate),
          ),
          duration: 10,
          order: 3,
        },
        { documentId: documents[1]._id },
      ].map(treatmentModule.generator.generate);
      const assignations = [
        {
          documentId: documents[0]._id,
          treatmentId: treatments[3]._id,
          userId: userId1,
        },
        {
          documentId: documents[1]._id,
          treatmentId: treatments[4]._id,
          userId: userId2,
        },
      ].map(assignationModule.generator.generate);
      await Promise.all(assignations.map(assignationRepository.insert));
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(treatments.map(treatmentRepository.insert));

      const aggregatedStatistics = await fetchAggregatedStatisticsAccordingToFilter(
        ressourceFilter,
        settings,
      );

      expect(aggregatedStatistics).toEqual({
        cumulatedValue: {
          subAnnotationsNonSensitiveCount: 0,
          subAnnotationsSensitiveCount: 1,
          surAnnotationsCount: 2,
          treatmentDuration: 10,
          annotationsCount: 3,
          wordsCount: 5,
        },
        total: 1,
      });
    });
  });
});
