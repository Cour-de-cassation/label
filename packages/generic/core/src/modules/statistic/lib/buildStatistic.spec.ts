import { documentModule } from '../../document';
import { idModule } from '../../id';
import { buildStatistic } from './buildStatistic';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);
const checklistMock = documentModule.checklistGenerator.generate(3);

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('buildStatistic', () => {
  it('should build a new statistic', () => {
    const annotationsCount = 10;
    const documentNumber = 123456;
    const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
    const documentPublicationCategory = ['P'];
    const documentRoute = 'exhaustive';
    const documentImporter = 'recent';
    const documentSource = 'SOURCE';
    const linkedEntitiesCount = 2;
    const jurisdiction = 'Cour de cassation';
    const userId = idModule.lib.buildId();
    const decisionDate = new Date().getTime();
    const document = documentModule.generator.generate({
      decisionMetadata: documentModule.decisionMetadataGenerator.generate({
        additionalTermsToAnnotate: '',
        appealNumber: 'TRUC',
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
      source: documentSource,
      route: documentRoute,
      importer: documentImporter,
      text: 'Some text with five words',
    });
    const treatmentInfo = {
      subAnnotationsNonSensitiveCount: 1,
      subAnnotationsSensitiveCount: 2,
      surAnnotationsCount: 3,
    };
    const lastUpdateDate = TREATMENT_DATE.getTime();

    const statistic = buildStatistic({
      annotationsCount,
      document,
      linkedEntitiesCount,
      lastUpdateDate,
      treatmentInfo,
      checklist: checklistMock,
      humanTreatmentsSummary: [{ userId, treatmentDuration: 10 }],
      comment: 'comment',
    });

    expect(statistic).toEqual({
      _id: statistic._id,
      annotationsCount,
      appealNumber: 'TRUC',
      chamberName: 'chambre criminelle',
      decisionDate,
      documentExternalId,
      documentNumber,
      jurisdiction: 'cour de cassation',
      linkedEntitiesCount,
      publicationCategory: documentPublicationCategory,
      session: 'FRH',
      route: documentRoute,
      importer: documentImporter,
      source: documentSource,
      subAnnotationsNonSensitiveCount: 1,
      subAnnotationsSensitiveCount: 2,
      surAnnotationsCount: 3,
      treatmentDate: TREATMENT_DATE.getTime(),
      treatmentsSummary: [{ userId, treatmentDuration: 10 }],
      wordsCount: 5,
      checklist: checklistMock,
      comment: 'comment',
    });
  });
});
