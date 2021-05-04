import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { addBoundDecisionDocumentNumbersInDocumentModel } from './addBoundDecisionDocumentNumbersInDocumentModel';

describe('addBoundDecisionDocumentNumbersInDocumentModel.spec', () => {
  it('should add an undefined boundDecisionExternalId value in the document data model in the database', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = [
      documentModule.generator.generate(),
      documentModule.generator.generate(),
      documentModule.generator.generate(),
    ];
    const documentsWithOldModel = documents.map((document) => ({
      ...omit(document, ['decisionMetadata']),
      decisionMetadata: omit(document.decisionMetadata, [
        'boundDecisionExternalId',
      ]),
    }));
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await addBoundDecisionDocumentNumbersInDocumentModel();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(documents.sort());
  });
});
