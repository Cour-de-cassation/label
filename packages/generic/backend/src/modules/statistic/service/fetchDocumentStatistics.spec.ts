import {
  documentModule,
  statisticModule,
  treatmentModule,
  assignationModule,
  annotationsDiffModule,
  annotationModule,
  userModule,
} from '@label/core';
import { buildAssignationRepository } from '../../assignation';
import { buildDocumentRepository } from '../../document';
import { buildTreatmentRepository } from '../../treatment';
import { buildStatisticRepository } from '../../statistic';
import { fetchDocumentStatistics } from './fetchDocumentStatistics';
import { buildUserRepository } from '../../user';

describe('fetchDocumentStatistic', () => {
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();
  const userRepository = buildUserRepository();

  describe('fetchDocumentStatistic', () => {
    it('should fetch DocumentStatistic', async () => {
      const date = new Date();
      const user = [{}, {}, {}].map(userModule.generator.generate);
      await Promise.all(user.map(userRepository.insert));

      const statistics = [
        {
          source: 'jurinet',
          documentNumber: 12345,
          treatmentsSummary: [
            {
              userId: user[0]._id,
              treatmentDuration: 10,
              email: "EMAIL",
              name: "NAME",
            } as any,
          ],
        },
        {
          source: 'jurica',
          treatmentDate: 50,
          documentNumber: 12345,
          treatmentsSummary: [
            {
              userId: user[0]._id,
              treatmentDuration: 10,
              email: "EMAIL",
              name: "NAME",
            } as any,
          ],
        },
        {
          source: 'juritj',
          documentNumber: 54321,
          treatmentsSummary: [
            {
              userId: user[0]._id,
              treatmentDuration: 10,
              email: "EMAIL",
              name: "NAME",
            } as any,
          ],
        }
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
        },
        {
          documentId: documents[1]._id,
          treatmentId: treatments[3]._id,
        },
      ].map(assignationModule.generator.generate);

      await Promise.all(assignations.map(assignationRepository.insert));
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(treatments.map(treatmentRepository.insert));

      const documentStatistics = await fetchDocumentStatistics(12345);

      expect(documentStatistics.length).toEqual(2);
    });
  });
});
