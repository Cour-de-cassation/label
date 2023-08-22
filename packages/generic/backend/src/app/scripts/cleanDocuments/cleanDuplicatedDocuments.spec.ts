import { documentModule, idModule } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { cleanDuplicatedDocuments } from './cleanDuplicatedDocuments';

describe('cleanDuplicatedDocuments', () => {
  it('should clean the DuplicatedDocuments', async () => {
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

    await cleanDuplicatedDocuments();

    const fetchedDocuments = await documentRepository.findAll();

    expect(fetchedDocuments.sort()).toEqual([originalDocument, otherDocument]);
  });
});
