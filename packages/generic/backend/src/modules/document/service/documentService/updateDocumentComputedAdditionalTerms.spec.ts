import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentComputedAdditionalTerms } from './updateDocumentComputedAdditionalTerms';

describe('updateDocumentComputedAdditionalTerms', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document computedAdditionalTerms', async () => {
    const document = documentModule.generator.generate({
      decisionMetadata: documentModule.decisionMetadataGenerator.generate({
        computedAdditionalTerms: undefined,
      }),
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentComputedAdditionalTerms(
      document._id,
      {
        additionalTermsToAnnotate: ['Pierre', 'Paul'],
        additionalTermsToUnAnnotate: ['Jacques'],
      },
    );

    expect(updatedDocument.decisionMetadata.computedAdditionalTerms).toEqual({
      additionalTermsToAnnotate: ['Pierre', 'Paul'],
      additionalTermsToUnAnnotate: ['Jacques'],
    });
  });
});
