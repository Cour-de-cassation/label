import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { renameDocumentIdToDocumentNumberInDocumentModel } from './renameDocumentIdToDocumentNumberInDocumentModel';

describe('renameDocumentIdToDocumentNumberInDocumentModel', () => {
  it('should rename password to hashedPassword in document model in the database', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = [
      documentModule.generator.generate(),
      documentModule.generator.generate(),
      documentModule.generator.generate(),
    ];
    const documentsWithOldModel = documents.map((document) => ({
      ...document,
      documentNumber: undefined,
      documentId: document.documentNumber,
    }));
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await renameDocumentIdToDocumentNumberInDocumentModel();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(documents.sort());
  });
});
