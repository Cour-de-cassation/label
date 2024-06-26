import { documentModule, treatmentModule, treatmentType } from '../../';
import { concat } from './concat';

describe('concat', () => {
  it('should return a labelTreatment', () => {
    const document = documentModule.generator.generate();
    const treatments: treatmentType[] = [
      {
        subAnnotationsSensitiveCount: 5,
        documentId: document._id,
        order: 2,
        source: 'annotator' as treatmentType['source'],
      },
      { documentId: document._id, order: 0, source: 'NLP' as treatmentType['source'] },
      { documentId: document._id, order: 1, source: 'postProcess' as treatmentType['source'] },
      { documentId: document._id, order: 3, source: 'admin' as treatmentType['source'] },
    ].map(treatmentModule.generator.generate);

    const labelTreatments = concat(treatments);

    expect(labelTreatments).toEqual([
      { annotations: [], order: 1, source: 'NLP' },
      { annotations: [], order: 2, source: 'LABEL_AUTO_TREATMENT' },
      { annotations: [], order: 3, source: 'LABEL_WORKING_USER_TREATMENT' },
      { annotations: [], order: 4, source: 'LABEL_ADMIN_USER_TREATMENT' },
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
      },
      { documentId: document._id, order: 0, source: 'reimportedTreatment' as treatmentType['source'] },
      { documentId: document._id, order: 2, source: 'admin' as treatmentType['source'] },
    ].map(treatmentModule.generator.generate);

    const labelTreatments = concat(treatments);

    expect(labelTreatments).toEqual([
      { annotations: [], order: 1, source: 'LABEL_WORKING_USER_TREATMENT' },
      { annotations: [], order: 2, source: 'LABEL_ADMIN_USER_TREATMENT' },
    ]);
  });
});
