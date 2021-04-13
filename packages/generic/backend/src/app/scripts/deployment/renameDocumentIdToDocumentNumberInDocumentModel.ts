import { buildDocumentRepository } from '../../../modules/document';

export { renameDocumentIdToDocumentNumberInDocumentModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function renameDocumentIdToDocumentNumberInDocumentModel() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  const documentsWithNewDataModel = documents.map((document) => ({
    ...document,
    documentId: undefined,
    documentNumber: (document as any).documentId,
  }));

  await documentRepository.clear();

  await Promise.all(documentsWithNewDataModel.map(documentRepository.insert));
}
