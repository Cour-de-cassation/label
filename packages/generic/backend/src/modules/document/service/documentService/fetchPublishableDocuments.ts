import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchPublishableDocuments };

async function fetchPublishableDocuments() {
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllByPublicationCategoryLettersProjection(
    documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
    [
      '_id',
      'creationDate',
      'decisionMetadata',
      'documentNumber',
      'publicationCategory',
      'route',
      'status',
    ],
  );

  // get documents without change the last code !! en haut
  const documentsWereRouteEqualsToConfirmation = (
    await documentRepository.findAll()
  ).filter((document) => document.route == 'confirmation');
  // adding new document where route == confirmation and filter if duplicate elem
  const allDocuments = documents.concat(documentsWereRouteEqualsToConfirmation);
  // use a set to follow documents
  const uniqueDocumentNumbers = new Set();
  // Filter the elements to take not same documents
  const filtredDocuments = allDocuments.filter((document) => {
    const isUnique = !uniqueDocumentNumbers.has(document.documentNumber);
    // adding documents
    uniqueDocumentNumbers.add(document.documentNumber);

    return isUnique;
  });

  return filtredDocuments
    .filter((document) => document.status !== 'rejected')
    .map(
      ({
        _id,
        creationDate,
        decisionMetadata,
        documentNumber,
        publicationCategory,
        route,
        status,
      }) => ({
        _id,
        appealNumber: decisionMetadata.appealNumber,
        chamberName: decisionMetadata.chamberName,
        jurisdiction: decisionMetadata.jurisdiction,
        creationDate,
        documentNumber,
        publicationCategory,
        route,
        status,
      }),
    );
}
