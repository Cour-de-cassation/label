import { buildDocumentRepository } from '../../../../modules/document';

export { renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  const documentsWithNewDataModel = documents.map((document) => ({
    ...document,
    decisionMetadata: {
      ...document.decisionMetadata,
      boundDecisionDocumentNumbers: [],
    },
  }));

  await documentRepository.clear();

  await Promise.all(documentsWithNewDataModel.map(documentRepository.insert));
}
