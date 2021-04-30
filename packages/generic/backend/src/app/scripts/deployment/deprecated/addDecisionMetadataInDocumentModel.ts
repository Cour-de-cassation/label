import { buildDocumentRepository } from '../../../../modules/document';

export { addDecisionMetadataInDocumentModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function addDecisionMetadataInDocumentModel() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  const documentsWithNewDataModel = documents.map((document) => ({
    ...document,
    decisionMetadata: {
      chamberName: '',
      juridiction: '',
    },
  }));

  await documentRepository.clear();

  await Promise.all(documentsWithNewDataModel.map(documentRepository.insert));
}
