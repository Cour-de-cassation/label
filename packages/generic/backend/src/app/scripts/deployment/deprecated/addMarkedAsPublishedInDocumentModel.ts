import { buildDocumentRepository } from '../../../../modules/document';

export { addMarkedAsPublishedInDocumentModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function addMarkedAsPublishedInDocumentModel() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  const documentsWithNewDataModel = documents.map((document) => ({
    ...document,
    markedAsPublished: false,
  }));

  await documentRepository.clear();

  await Promise.all(documentsWithNewDataModel.map(documentRepository.insert));
}
