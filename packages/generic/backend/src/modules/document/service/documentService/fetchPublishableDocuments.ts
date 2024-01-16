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

  //get decisions by route
  const documentByConfirmationRoute = await documentRepository.findAllByRoute(
    'confirmation',
  );
  // adding new document where route == confirmation and filter if duplicate elem
  const allDocuments = documents.concat(documentByConfirmationRoute);
  // use a set to follow documents
  const uniqueDocumentNumbers = new Set();
  return allDocuments
    .filter((document) => {
      if (document.status !== 'rejected') {
        const isUnique = !uniqueDocumentNumbers.has(document.documentNumber);
        // adding documents
        uniqueDocumentNumbers.add(document.documentNumber);
        return isUnique;
      }
    })
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
