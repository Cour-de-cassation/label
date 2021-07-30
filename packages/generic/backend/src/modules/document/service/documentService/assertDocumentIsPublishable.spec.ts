import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { assertDocumentIsPublishable } from './assertDocumentIsPublishable';

describe('assertDocumentIsPublishable', () => {
  const documentRepository = buildDocumentRepository();

  it('should throw an error if the document status is not right', async () => {
    const document = documentModule.generator.generate({ status: 'free' });
    await documentRepository.insert(document);

    expect(assertDocumentIsPublishable(document._id)).rejects.toThrowError(
      `The document is not publishable, because its current status is "free"`,
    );
  });

  it('should throw an error if the document publication category is not right', async () => {
    const document = documentModule.generator.generate({
      status: 'toBePublished',
      publicationCategory: ['N', 'W'],
    });
    await documentRepository.insert(document);

    expect(assertDocumentIsPublishable(document._id)).rejects.toThrowError(
      `The document is not publishable, because its publication category is "N, W"`,
    );
  });
});
