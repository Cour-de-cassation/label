import { documentModule } from '../../document';
import { idModule } from '../../id';
import { buildStatistic } from './buildStatistic';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);

describe('buildStatistic', () => {
  it('should build a new statistic', () => {
    const annotationsCount = 10;
    const documentNumber = 123456;
    const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
    const documentPublicationCategory = ['P'];
    const documentSource = 'SOURCE';
    const linkedEntitiesCount = 2;
    const jurisdiction = 'Cour de cassation';
    const userId = idModule.lib.buildId();
    const decisionDate = new Date().getTime();
    const document = documentModule.generator.generate({
      decisionMetadata: {
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
      },
      documentNumber,
      externalId: documentExternalId,
      publicationCategory: documentPublicationCategory,
      source: documentSource,
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
      humanTreatmentsSummary: [{ userId, treatmentDuration: 10 }],
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
      source: documentSource,
      subAnnotationsNonSensitiveCount: 1,
      subAnnotationsSensitiveCount: 2,
      surAnnotationsCount: 3,
      treatmentDate: TREATMENT_DATE.getTime(),
      treatmentsSummary: [{ userId, treatmentDuration: 10 }],
      wordsCount: 5,
    });
  });
});
