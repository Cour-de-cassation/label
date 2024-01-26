import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentComputedAdditionalTerms } from './updateDocumentComputedAdditionalTerms';

describe('updateDocumentComputedAdditionalTerms', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document computedAdditionalTerms', async () => {
    const document = documentModule.generator.generate({
      decisionMetadata: {
        appealNumber: '',
        additionalTermsToAnnotate: '',
        computedAdditionalTerms: undefined,
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: ['categorie1', 'categorie2'],
        chamberName: '',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        date: 0,
        jurisdiction: '',
        occultationBlock: 0,
        NACCode: '',
        endCaseCode: '',
        parties: [],
        session: '',
        solution: '',
      },
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentComputedAdditionalTerms(
      document._id,
      { additionalTermsToAnnotate: ["Pierre", "Paul"], additionalTermsToUnAnnotate: ["Jacques"] });

    expect(document.decisionMetadata.computedAdditionalTerms).toEqual({ additionalTermsToAnnotate: ["Pierre", "Paul"], additionalTermsToUnAnnotate: ["Jacques"] });
  });
});
