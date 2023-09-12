import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchPublishableDocuments };

async function fetchPublishableDocuments() {
  const documentRepository = buildDocumentRepository();
  const documents =
    await documentRepository.findAllByPublicationCategoryLetters(
      documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
    );
  return documents.filter(
    (document: documentType) => document.status !== 'rejected',
  );
}
