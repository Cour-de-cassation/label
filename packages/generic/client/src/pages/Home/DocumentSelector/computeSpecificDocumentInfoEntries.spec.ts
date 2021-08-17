import { documentModule } from '@label/core';
import { computeSpecificDocumentInfoEntries } from './computeSpecificDocumentInfoEntries';

describe('computeSpecificDocumentInfoEntries', () => {
  it('should return all the specific infos of a document', () => {
    const document = documentModule.generator.generate({
      documentNumber: 1234567,
      decisionMetadata: {
        chamberName: 'Civile',
        juridiction: 'Cour de cassation',
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: [],
        additionalTermsToAnnotate: '',
        occultationBlock: undefined,
        session: '',
        solution: '',
      },
    });

    const specificDocumentInfoEntries = computeSpecificDocumentInfoEntries(document);

    expect(specificDocumentInfoEntries).toEqual({ decisionNumber: 1234567, chamberName: 'Civile' });
  });

  it('should return blank infos', () => {
    const document = documentModule.generator.generate({ documentNumber: 1234567 });

    const specificDocumentInfoEntries = computeSpecificDocumentInfoEntries(document);

    expect(specificDocumentInfoEntries).toEqual({ decisionNumber: 1234567, chamberName: '-' });
  });
});
