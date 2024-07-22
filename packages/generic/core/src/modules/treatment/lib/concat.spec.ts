import { documentModule, treatmentModule, treatmentType } from '../../';
import { concat } from './concat';

describe('concat', () => {
  const nlpVersion = {
    juriSpacyTokenizer: {
      version: `VERSION_${Math.random()}`,
      date: `DATE_${Math.random()}`,
    },
    juritools: {
      version: `VERSION_${Math.random()}`,
      date: `DATE_${Math.random()}`,
    },
    pseudonymisationApi: {
      version: `VERSION_${Math.random()}`,
      date: `DATE_${Math.random()}`,
    },
    model: {
      name: `MODEL_${Math.random()}`,
    },
  };

  it('should return a labelTreatment', () => {
    const document = documentModule.generator.generate();
    const treatments: treatmentType[] = [
      {
        subAnnotationsSensitiveCount: 5,
        documentId: document._id,
        order: 2,
        source: 'annotator' as treatmentType['source'],
        lastUpdateDate: 1720776507700,
      },
      { documentId: document._id, order: 0, source: 'NLP' as treatmentType['source'], lastUpdateDate: 1720773507000 },
      {
        documentId: document._id,
        order: 1,
        source: 'postProcess' as treatmentType['source'],
        lastUpdateDate: 1720776567000,
      },
      { documentId: document._id, order: 3, source: 'admin' as treatmentType['source'], lastUpdateDate: 1720776507123 },
    ].map(treatmentModule.generator.generate);

    const labelTreatments = concat(treatments, nlpVersion);

    expect(labelTreatments).toEqual([
      { annotations: [], order: 1, source: 'NLP', treatmentDate: '2024-07-12T08:38:27.000Z', version: nlpVersion },
      {
        annotations: [],
        order: 2,
        source: 'LABEL_AUTO_TREATMENT',
        treatmentDate: '2024-07-12T09:29:27.000Z',
        version: undefined,
      },
      {
        annotations: [],
        order: 3,
        source: 'LABEL_WORKING_USER_TREATMENT',
        treatmentDate: '2024-07-12T09:28:27.700Z',
        version: undefined,
      },
      {
        annotations: [],
        order: 4,
        source: 'LABEL_WORKING_USER_TREATMENT',
        treatmentDate: '2024-07-12T09:28:27.123Z',
        version: undefined,
      },
    ]);
  });

  it('should return a labelTreatment when there is a reimported treatment', () => {
    const document = documentModule.generator.generate();
    const treatments: treatmentType[] = [
      {
        subAnnotationsSensitiveCount: 5,
        documentId: document._id,
        order: 1,
        source: 'annotator' as treatmentType['source'],
        lastUpdateDate: 1720776507000,
      },
      {
        documentId: document._id,
        order: 0,
        source: 'reimportedTreatment' as treatmentType['source'],
        lastUpdateDate: 1720776597300,
      },
      { documentId: document._id, order: 2, source: 'admin' as treatmentType['source'], lastUpdateDate: 1720776507000 },
    ].map(treatmentModule.generator.generate);

    const labelTreatments = concat(treatments);

    expect(labelTreatments).toEqual([
      {
        annotations: [],
        order: 1,
        source: 'LABEL_WORKING_USER_TREATMENT',
        version: undefined,
        treatmentDate: '2024-07-12T09:28:27.000Z',
      },
      {
        annotations: [],
        order: 2,
        source: 'LABEL_WORKING_USER_TREATMENT',
        version: undefined,
        treatmentDate: '2024-07-12T09:28:27.000Z',
      },
    ]);
  });
});
