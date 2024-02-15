import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentAdditionalTermsParsingFailed } from './updateDocumentAdditionalTermsParsingFailed';

describe('updateDocumentAdditionalTermsParsingFailed', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document updateDocumentAdditionalTermsParsingFailed', async () => {
    const document = documentModule.generator.generate({
      decisionMetadata: {
        appealNumber: '',
        additionalTermsToAnnotate: '',
        computedAdditionalTerms: undefined,
        additionalTermsParsingFailed: false,
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: [],
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

    const updatedDocument = await updateDocumentAdditionalTermsParsingFailed(
      document._id,
      true,
    );

    expect(
      updatedDocument.decisionMetadata.additionalTermsParsingFailed,
    ).toEqual(true);
  });
});
