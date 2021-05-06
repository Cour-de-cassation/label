import { buildDocumentRepository } from '../../../../modules/document';

export { changeTypeCreationDateInDocumentModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function changeTypeCreationDateInDocumentModel() {
  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  const documentsWithNewDataModel = documents.map((document) => {
    const newCreationDateTime = new Date(document.creationDate).getTime();

    return {
      ...document,
      creationDate: isNaN(newCreationDateTime)
        ? new Date().getTime()
        : newCreationDateTime,
    };
  });

  await documentRepository.clear();

  await Promise.all(documentsWithNewDataModel.map(documentRepository.insert));
}
