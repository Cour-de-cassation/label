import { documentModule, treatmentModule, treatmentType } from '../../';
import { concat } from './concat';

describe('concat', () => {
  it('should return a labelTreatment', () => {
    const document = documentModule.generator.generate();
    const treatments: treatmentType[] = [
      {
        subAnnotationsSensitiveCount: 5,
        documentId: document._id,
        order: 4,
        source: 'annotator' as treatmentType['source'],
      },
      { documentId: document._id, order: 0, source: 'NLPTagger' as treatmentType['source'] },
      { documentId: document._id, order: 1, source: 'NLPPostProcess' as treatmentType['source'] },
      { documentId: document._id, order: 2, source: 'NLP' as treatmentType['source'] },
      { documentId: document._id, order: 3, source: 'postProcess' as treatmentType['source'] },
    ].map(treatmentModule.generator.generate);

    const labelTreatments = concat(treatments);

    expect(labelTreatments).toEqual([
      { annotations: [], order: 1, source: 'NLP_TAGGER' },
      { annotations: [], order: 2, source: 'NLP_POSTPROCESS' },
      { annotations: [], order: 3, source: 'NLP' },
      { annotations: [], order: 4, source: 'LABEL_AUTO_TREATMENT' },
      { annotations: [], order: 5, source: 'LABEL_WORKING_USER_TREATMENT' },
    ]);
  });
});
