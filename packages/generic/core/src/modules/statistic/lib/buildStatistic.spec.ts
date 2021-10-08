import { documentModule } from '../../document';
import { idModule } from '../../id';
import { treatmentModule } from '../../treatment';
import { buildStatistic } from './buildStatistic';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);

describe('buildStatistic', () => {
  it('should build a new statistic', () => {
    const annotationsCount = 10;
    const documentNumber = 123456;
    const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
    const documentPublicationCategory = ['P'];
    const documentSource = 'SOURCE';
    const duration = 1500;
    const linkedEntitiesCount = 2;
    const jurisdiction = 'Cour de cassation';
    const userId = idModule.lib.buildId();
    const decisionDate = new Date().getTime();
    const document = documentModule.generator.generate({
      decisionMetadata: {
        additionalTermsToAnnotate: '',
        appealNumber: '',
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: [],
        chamberName: '',
        date: decisionDate,
        jurisdiction,
        occultationBlock: undefined,
        session: '',
        solution: '',
      },
      documentNumber,
      externalId: documentExternalId,
      publicationCategory: documentPublicationCategory,
      source: documentSource,
      text: 'Some text with five words',
    });
    const treatment = treatmentModule.generator.generate({
      documentId: document._id,
      duration,
      lastUpdateDate: TREATMENT_DATE.getTime(),
      subAnnotationsNonSensitiveCount: 1,
      subAnnotationsSensitiveCount: 2,
      surAnnotationsCount: 3,
    });

    const statistic = buildStatistic({
      annotationsCount,
      document,
      linkedEntitiesCount,
      treatment,
      treatmentsSummary: [{ userId, treatmentDuration: 10 }],
    });

    expect(statistic).toEqual({
      _id: statistic._id,
      annotationsCount,
      decisionDate,
      documentExternalId,
      documentNumber,
      jurisdiction: 'Cour de cassation',
      linkedEntitiesCount,
      publicationCategory: documentPublicationCategory,
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
