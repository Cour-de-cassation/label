import {
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
          addedAnnotationsCount: { sensitive: 3, other: 1 },
          annotationsCount: 9,
          deletedAnnotationsCount: { anonymised: 3, other: 2 },
          documentExternalId: 'DOCUMENT_EXTERNAL_ID_0',
          linkedEntitiesCount: 3,
          modifiedAnnotationsCount: {
            nonAnonymisedToSensitive: 0,
            anonymisedToNonAnonymised: 0,
            other: 3,
          },
          resizedBiggerAnnotationsCount: { sensitive: 3, other: 0 },
          resizedSmallerAnnotationsCount: { anonymised: 3, other: 0 },
          treatmentDuration: 3,
          userId: userId1,
          wordsCount: 9,
        },
        { userId: userId2 },
        {
          addedAnnotationsCount: { sensitive: 4, other: 1 },
          annotationsCount: 9,
          deletedAnnotationsCount: { anonymised: 4, other: 3 },
          documentExternalId: 'DOCUMENT_EXTERNAL_ID_0',
          linkedEntitiesCount: 4,
          modifiedAnnotationsCount: {
            nonAnonymisedToSensitive: 0,
            anonymisedToNonAnonymised: 0,
            other: 4,
          },
          resizedBiggerAnnotationsCount: { sensitive: 4, other: 0 },
          resizedSmallerAnnotationsCount: { anonymised: 4, other: 0 },
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
            subAnnotationsNonSensitiveCount: 2,
            subAnnotationsSensitiveCount: 14,
            surAnnotationsCount: 14,
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
          documentId: documents[0]._id,
          order: 0,
          duration: 0,
        },
        {
          deletedAnnotationsCount: { anonymised: 1, other: 0 },
          addedAnnotationsCount: { sensitive: 1, other: 0 },
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
            subAnnotationsNonSensitiveCount: 0,
            subAnnotationsSensitiveCount: 1,
            surAnnotationsCount: 1,
            treatmentDuration: 10,
          },
          total: 1,
        },
        perDocument: {
          cumulatedValue: {
            annotationsCount: 0,
            wordsCount: 5,
          },
          total: 1,
        },
      });
    });
  });
});
