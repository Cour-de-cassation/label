import { documentModule } from '@label/core';
import { computeSpecificDocumentInfoEntries } from './computeSpecificDocumentInfoEntries';

describe('computeSpecificDocumentInfoEntries', () => {
  it('should return all the specific infos of a document', () => {
    const decisionDate = new Date().getTime();
    const document = documentModule.generator.generate({
      documentNumber: 1234567,
      decisionMetadata: {
        appealNumber: '',
        chamberName: 'Civile',
        civilCaseCode: '',
        criminalCaseCode: '',
        civilMatterCode: '',
        date: decisionDate,
        jurisdiction: 'Cour de cassation',
        NACCode: '',
        endCaseCode: '',
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: [],
        additionalTermsToAnnotate: '',
        occultationBlock: undefined,
        parties: [],
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
