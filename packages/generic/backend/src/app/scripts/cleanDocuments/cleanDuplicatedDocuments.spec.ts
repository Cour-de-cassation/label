import { documentModule, idModule } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { cleanDuplicatedDocuments } from './cleanDuplicatedDocuments';

describe('cleanDuplicatedDocuments', () => {
  it('should clean the DuplicatedDocuments', async () => {
    const firstDocument = documentModule.generator.generate();
    const secondDocument = documentModule.generator.generate({
      creationDate: 1274657452000
    });
    const secondDocumentWithHigherStatus = documentModule.generator.generate({
      ...secondDocument,
      creationDate: 1674657452000,
      _id: idModule.lib.buildId(),
      status: 'done',
    });

    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany([
      firstDocument,
      secondDocument,
      secondDocumentWithHigherStatus
    ]);

    await cleanDuplicatedDocuments();

    const fetchedDocuments = await documentRepository.findAll();

    const fetchedIds = fetchedDocuments.map((u) => {
      if (u.creationDate !== undefined) {
        console.log('log creation date', new Date(u.creationDate).getFullYear());
        console.log('ids  --------', u._id)
      }
      return u._id;
    }).sort();
    const expectedIds = [firstDocument, secondDocumentWithHigherStatus]
      .map((u) => {
        if (u.creationDate !== undefined) {
          console.log('log expectedIds', new Date(u.creationDate).getFullYear());
          console.log('expectedIds  --------', u._id)
        }
        return u._id;
      })
      .sort();
    expect(fetchedIds).toEqual(expectedIds);
  });
});
