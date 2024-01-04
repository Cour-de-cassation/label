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

  const documentsWereRouteEqualsToConfirmation = await (await documentRepository.findAll()).filter(
    (document) => document.route == 'confirmation'
  )
  const allDocuments = documents.concat(documentsWereRouteEqualsToConfirmation)

  return allDocuments
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
