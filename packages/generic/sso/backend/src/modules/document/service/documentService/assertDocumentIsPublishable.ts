import { errorHandlers } from 'sder-core';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { assertDocumentIsPublishable };

async function assertDocumentIsPublishable(documentId: documentType['_id']) {
  const documentRepository = buildDocumentRepository();

  const document = await documentRepository.findById(documentId);
  const publishedPublicationCategoryLetters = documentModule.lib.publicationHandler.getPublishedPublicationCategory();
  if (document.status !== 'done' && document.status !== 'toBePublished') {
    throw errorHandlers.permissionErrorHandler.build(
      `The document is not publishable, because its current status is "${document.status}"`,
    );
  }

  if (
    !publishedPublicationCategoryLetters.some((publicationCategoryLetter) =>
      document.publicationCategory.includes(publicationCategoryLetter),
    )
  ) {
    throw errorHandlers.permissionErrorHandler.build(
      `The document is not publishable, because its publication category is "${document.publicationCategory.join(
        ', ',
      )}"`,
    );
  }
  return true;
}
