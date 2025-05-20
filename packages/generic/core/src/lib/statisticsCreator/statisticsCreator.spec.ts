import { annotationModule } from '../../modules/annotation';
import { annotationsDiffModule } from '../../modules/annotationsDiff';
import { documentModule } from '../../modules/document';
import { idModule } from '../../modules/id';
import { treatmentModule } from '../../modules/treatment';
import { settingsModule } from '../../modules/settings';
import { statisticsCreator } from './statisticsCreator';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('statisticsCreator', () => {
  const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
  const documentPublicationCategory = ['P'];
  const documentSource = 'SOURCE';
  const documentNumber = 123456;
  const jurisdiction = 'Cour de cassation';
  const duration = 1500;
  const userId = idModule.lib.buildId();
  const decisionDate = new Date().getTime();
  const documentChecklist = documentModule.checklistGenerator.generate(4);
  const document = documentModule.generator.generate({
    decisionMetadata: documentModule.decisionMetadataGenerator.generate({
      additionalTermsToAnnotate: '',
      appealNumber: 'MACHIN',
      boundDecisionDocumentNumbers: [],
      categoriesToOmit: [],
      chamberName: 'Chambre criminelle',
      criminalCaseCode: '',
      civilCaseCode: '',
      civilMatterCode: '',
      date: decisionDate,
      jurisdiction,
      NACCode: '',
      endCaseCode: '',
      occultationBlock: undefined,
      parties: [],
      session: 'FRH',
      solution: '',
    }),
    documentNumber,
    externalId: documentExternalId,
    publicationCategory: documentPublicationCategory,
    route: 'exhaustive',
    importer: 'recent',
    source: documentSource,
    text: 'Some text with five words',
    checklist: documentChecklist,
  });
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
    professionnelNom: { isSensitive: false, isAnonymized: false },
  });

  describe('buildFromDocument', () => {
    it('should build all the statistics of the given documents', () => {
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
          source: 'NLP',
          lastUpdateDate: TREATMENT_DATE.getTime(),
        } as const,
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
          source: 'postProcess',
          documentId: document._id,
          duration,
          order: 1,
          lastUpdateDate: TREATMENT_DATE.getTime(),
        } as const,
      ].map(treatmentModule.generator.generate);

      const statistic = statisticsCreator.buildFromDocument({
        humanTreatments: [{ treatment: treatments[1], userId }],
        document,
        treatments: treatments,
        settings,
        comment: 'comment',
      });

      expect(statistic).toEqual({
        _id: statistic._id,
        annotationsCount: 3,
        appealNumber: 'MACHIN',
        chamberName: 'chambre criminelle',
        decisionDate,
        documentExternalId,
        documentNumber,
        jurisdiction: 'cour de cassation',
        linkedEntitiesCount: 0,
        publicationCategory: documentPublicationCategory,
        session: 'FRH',
        route: 'exhaustive',
        importer: 'recent',
        source: documentSource,
        subAnnotationsNonSensitiveCount: 0,
        surAnnotationsCount: 2,
        subAnnotationsSensitiveCount: 1,
        treatmentDate: TREATMENT_DATE.getTime(),
        treatmentsSummary: [{ userId, treatmentDuration: duration }],
        wordsCount: 5,
        checklist: documentChecklist,
        comment: 'comment',
      });
    });

    it('should build all the statistics of the given document for one piece of statistics', () => {
      const treatments = [
        {
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [],
            [
              { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
              { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
              { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
              { start: 100, text: 'Fantasio', category: 'professionnelNom' },
            ].map(annotationModule.generator.generate),
          ),
          documentId: document._id,
          order: 0,
          route: 'exhaustive',
          source: 'NLP' as const,
          lastUpdateDate: TREATMENT_DATE.getTime(),
        },
        {
          annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
            [{ start: 100, text: 'Fantasio', category: 'professionnelNom' }].map(annotationModule.generator.generate),
            [{ start: 100, text: 'Fantasio', category: 'personnePhysiqueNom' }].map(
              annotationModule.generator.generate,
            ),
          ),
          documentId: document._id,
          duration,
          order: 1,
          route: 'exhaustive',
          source: 'postProcess' as const,
          lastUpdateDate: TREATMENT_DATE.getTime(),
        },
      ].map(treatmentModule.generator.generate);

      const statistic = statisticsCreator.buildFromDocument({
        document,
        treatments: treatments,
        humanTreatments: [{ treatment: treatments[1], userId }],
        settings,
      });

      expect(statistic).toEqual({
        _id: statistic._id,
        annotationsCount: 4,
        appealNumber: 'MACHIN',
        chamberName: 'chambre criminelle',
        decisionDate,
        documentExternalId,
        documentNumber,
        jurisdiction: 'cour de cassation',
        linkedEntitiesCount: 0,
        publicationCategory: documentPublicationCategory,
        session: 'FRH',
        route: 'exhaustive',
        importer: 'recent',
        source: documentSource,
        subAnnotationsNonSensitiveCount: 0,
        surAnnotationsCount: 0,
        subAnnotationsSensitiveCount: 1,
        treatmentDate: TREATMENT_DATE.getTime(),
        treatmentsSummary: [{ userId, treatmentDuration: duration }],
        wordsCount: 5,
        checklist: documentChecklist,
      });
    });
  });
});
