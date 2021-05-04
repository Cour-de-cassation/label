import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { changeTypeCreationDateInDocumentModel } from './changeTypeCreationDateInDocumentModel';

describe('changeTypeCreationDateInDocumentModel', () => {
  it('should rename password to hashedPassword in document model in the database', async () => {
    const date = new Date();
    const documentRepository = buildDocumentRepository();
    const documents = [
      documentModule.generator.generate({ creationDate: date.getTime() }),
      documentModule.generator.generate({ creationDate: date.getTime() }),
      documentModule.generator.generate({ creationDate: date.getTime() }),
    ];
    const documentsWithOldModel = documents.map((document) => ({
      ...document,
      creationDate: date,
    }));
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await changeTypeCreationDateInDocumentModel();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(documents.sort());
  });
});
