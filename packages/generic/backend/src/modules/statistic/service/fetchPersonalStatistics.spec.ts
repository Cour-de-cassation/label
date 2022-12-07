import {
  documentModule,
  statisticModule,
  treatmentModule,
  assignationModule,
  settingsModule,
  annotationsDiffModule,
  annotationModule,
  userModule,
  documentType,
} from '@label/core';
import { buildAssignationRepository } from '../../assignation';
import { buildDocumentRepository } from '../../document';
import { buildTreatmentRepository } from '../../treatment';
import { buildStatisticRepository } from '../repository';
import { fetchPersonalStatistics } from './fetchPersonalStatistics';

describe('fetchPersonalStatistics', () => {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
  });

  describe('fetchPersonalStatistics', () => {
    it('should fetch fetchPersonalStatistics', async () => {
      const date = new Date();
      const user = userModule.generator.generate();
      const statistics = [
        {
          subAnnotationsSensitiveCount: 6,
          subAnnotationsNonSensitiveCount: 1,
          surAnnotationsCount: 6,
          annotationsCount: 9,
          linkedEntitiesCount: 3,
          treatmentDate: date.getTime(),
          treatmentsSummary: [{ userId: user._id, treatmentDuration: 3 }],
          route: 'exhaustive' as documentType['route'],
          wordsCount: 9,
        },
        {
          subAnnotationsSensitiveCount: 6,
          subAnnotationsNonSensitiveCount: 1,
          surAnnotationsCount: 6,
          annotationsCount: 9,
          linkedEntitiesCount: 3,
          treatmentDuration: 3,
          treatmentDate: date.getTime(),
          treatmentsSummary: [{ userId: user._id, treatmentDuration: 50 }],
          route: 'simple' as documentType['route'],
          wordsCount: 9,
        },
      ].map(statisticModule.generator.generate);
      await Promise.all(statistics.map(statisticRepository.insert));

      const documents = ([
        {
          source: 'SOURCE1',
          status: 'done',
          text: 'Some text with five words',
          route: 'exhaustive',
        },
        { status: 'done', route: 'simple' },
        { status: 'saved' },
      ] as const).map(documentModule.generator.generate);
      const treatments = [
        {
          documentId: documents[0]._id,
          order: 0,
          duration: 0,
          source: 'NLP' as const,
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            [
              { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
              { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
              { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
            ].map(annotationModule.generator.generate),
          ),
          lastUpdateDate: date.getTime(),
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
          order: 1,
          lastUpdateDate: date.getTime(),
        },
        {
          documentId: documents[0]._id,
          source: 'annotator' as const,
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
          order: 2,
          lastUpdateDate: date.getTime(),
        },
        {
          documentId: documents[1]._id,
          lastUpdateDate: date.getTime(),
        },
      ].map(treatmentModule.generator.generate);
      const assignations = [
        {
          documentId: documents[0]._id,
          treatmentId: treatments[1]._id,
          userId: user._id,
        },
        {
          documentId: documents[1]._id,
          treatmentId: treatments[3]._id,
          userId: user._id,
        },
      ].map(assignationModule.generator.generate);
      await Promise.all(assignations.map(assignationRepository.insert));
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(treatments.map(treatmentRepository.insert));

      const aggregatedStatistics = await fetchPersonalStatistics(
        user,
        settings,
      );

      expect(aggregatedStatistics).toEqual([
        { day: date.setHours(0, 0, 0, 0), exhaustive: 2, simple: 2 },
      ]);
    });
  });
});
