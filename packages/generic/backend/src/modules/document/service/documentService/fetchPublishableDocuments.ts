import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchPublishableDocuments };

async function fetchPublishableDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.findAllByPublicationCategoryLettersProjection(
    documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
    ['_id', 'creationDate', 'documentNumber', 'publicationCategory', 'status'],
  );
}
