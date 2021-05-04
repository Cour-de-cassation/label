import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { addMarkedAsPublishedInDocumentModel } from './addMarkedAsPublishedInDocumentModel';

xdescribe('addMarkedAsPublishedInDocumentModel.spec', () => {
  it('should add a false markedAsPublished value in the document data model in the database', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = [
      documentModule.generator.generate(),
      documentModule.generator.generate(),
      documentModule.generator.generate(),
    ];
    const documentsWithOldModel = documents.map((document) =>
      omit(document, ['markedAsPublished']),
    );
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await addMarkedAsPublishedInDocumentModel();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(documents.sort());
  });
});
