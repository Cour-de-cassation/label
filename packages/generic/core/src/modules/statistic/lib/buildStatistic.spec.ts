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
      deletedAnnotationsCount: { anonymised: 2, other: 1 },
      addedAnnotationsCount: { sensitive: 1, other: 1 },
      resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
      modifiedAnnotationsCount: { nonAnonymisedToSensitive: 0, anonymisedToNonAnonymised: 0, other: 1 },
      resizedBiggerAnnotationsCount: { sensitive: 0, other: 1 },
      lastUpdateDate: TREATMENT_DATE.getTime(),
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
      addedAnnotationsCount: { sensitive: 1, other: 1 },
      annotationsCount,
      decisionDate,
      deletedAnnotationsCount: { anonymised: 2, other: 1 },
      documentExternalId,
      documentNumber,
      jurisdiction: 'Cour de cassation',
      linkedEntitiesCount,
      modifiedAnnotationsCount: { nonAnonymisedToSensitive: 0, anonymisedToNonAnonymised: 0, other: 1 },
      publicationCategory: documentPublicationCategory,
      resizedBiggerAnnotationsCount: { sensitive: 0, other: 1 },
      resizedSmallerAnnotationsCount: { anonymised: 0, other: 0 },
      source: documentSource,
      treatmentDate: TREATMENT_DATE.getTime(),
      treatmentsSummary: [{ userId, treatmentDuration: 10 }],
      wordsCount: 5,
    });
  });
});
