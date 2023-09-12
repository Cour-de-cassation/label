import { documentModule, idModule } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { cleanDoubledDocuments } from './cleanDoubledDocuments';

describe('cleanDoubledDocuments', () => {
  it('should clean the doubledDocuments', async () => {
    const originalDocument = documentModule.generator.generate();
    const otherDocument = documentModule.generator.generate();
    const doubledDocument = documentModule.generator.generate({
      ...originalDocument,
      _id: idModule.lib.buildId(),
    });
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany([
      originalDocument,
      otherDocument,
      doubledDocument,
    ]);

    await cleanDoubledDocuments();

    const fetchedDocuments = await documentRepository.findAll();

    expect(fetchedDocuments.sort()).toEqual([originalDocument, otherDocument]);
  });
});
