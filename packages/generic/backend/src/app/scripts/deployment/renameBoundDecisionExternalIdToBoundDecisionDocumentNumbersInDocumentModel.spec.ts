import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel } from './renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel';

describe('renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel.spec', () => {
  it('should add an [] boundDecisionDocumentNumbers value in the document data model in the database', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = [
      documentModule.generator.generate(),
      documentModule.generator.generate(),
      documentModule.generator.generate(),
    ];
    const documentsWithOldModel = documents.map((document) => ({
      ...omit(document, ['decisionMetadata']),
      decisionMetadata: omit(document.decisionMetadata, [
        'boundDecisionDocumentNumbers',
      ]),
    }));
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(documents.sort());
  });
});
