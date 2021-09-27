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
      'status',
    ],
  );
  return documents.map(
    ({
      _id,
      creationDate,
      decisionMetadata,
      documentNumber,
      publicationCategory,
      status,
    }) => ({
      _id,
      appealNumber: decisionMetadata.appealNumber,
      chamberName: decisionMetadata.chamberName,
      jurisdiction: decisionMetadata.jurisdiction,
      publicationCategory,
      creationDate,
      documentNumber,
      status,
    }),
  );
}
