import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchPublishableDocumentsToExport };

async function fetchPublishableDocumentsToExport() {
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllByPublicationCategoryLettersAndStatus(
    documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
    ['toBePublished', 'done'],
  );
  return documents;
}
