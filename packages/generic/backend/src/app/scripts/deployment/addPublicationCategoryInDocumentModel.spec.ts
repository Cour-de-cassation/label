import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { addPublicationCategoryInDocumentModel } from './addPublicationCategoryInDocumentModel';

describe('addPublicationCategoryInDocumentModel.spec', () => {
  it('should add an empty publication category in the document data model in the database', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = [
      documentModule.generator.generate(),
      documentModule.generator.generate(),
      documentModule.generator.generate(),
    ];
    const documentsWithOldModel = documents.map((document) =>
      omit(document, ['publicationCategory']),
    );
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await addPublicationCategoryInDocumentModel();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(documents.sort());
  });
});
