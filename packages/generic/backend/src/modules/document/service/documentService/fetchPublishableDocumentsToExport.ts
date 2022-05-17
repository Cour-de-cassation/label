import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchPublishableDocumentsToExport };

async function fetchPublishableDocumentsToExport() {
  const documentRepository = buildDocumentRepository();
  const lettersDocuments = await documentRepository.findAllByPublicationCategoryLettersAndStatus(
    documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
    ['toBePublished', 'done'],
  );
  const codesDocuments = await documentRepository.findAllByNACCodesAndStatus(
    documentModule.lib.publicationHandler.getPrioritizedNACCodes(),
    ['toBePublished', 'done'],
  );
  return [...lettersDocuments, ...codesDocuments];
}
