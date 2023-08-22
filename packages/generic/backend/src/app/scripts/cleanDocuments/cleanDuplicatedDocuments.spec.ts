import { documentModule, idModule } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { cleanDuplicatedDocuments } from './cleanDuplicatedDocuments';

describe('cleanDuplicatedDocuments', () => {
  it('should clean the DuplicatedDocuments', async () => {
    const firstDocument = documentModule.generator.generate();
    const secondDocument = documentModule.generator.generate();
    const secondDocumentWithHigherStatus = documentModule.generator.generate({
      ...secondDocument,
      _id: idModule.lib.buildId(),
      status: 'done',
    });
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany([
      firstDocument,
      secondDocument,
      secondDocumentWithHigherStatus,
    ]);

    await cleanDuplicatedDocuments();

    const fetchedDocuments = await documentRepository.findAll();

    const fetchedIds = fetchedDocuments.map((u) => u._id).sort();
    const expectedIds = [firstDocument, secondDocumentWithHigherStatus]
      .map((u) => u._id)
      .sort();
    expect(fetchedIds).toEqual(expectedIds);
  });
});
