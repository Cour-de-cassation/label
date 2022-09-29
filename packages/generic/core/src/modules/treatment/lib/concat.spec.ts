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
    ].map(treatmentModule.generator.generate);

    const labelTreatments = concat(treatments);

    expect(labelTreatments).toEqual([
      { annotations: [], order: 1, source: 'NLP' },
      { annotations: [], order: 2, source: 'LABEL_AUTO_TREATMENT' },
      { annotations: [], order: 3, source: 'LABEL_WORKING_USER_TREATMENT' },
    ]);
  });
});
