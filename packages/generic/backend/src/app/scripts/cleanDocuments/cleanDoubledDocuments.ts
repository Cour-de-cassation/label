import { documentType } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanDoubledDocuments };

/**
 * Delete all doubled documents (same source, same documentNumber, same text)
 */
async function cleanDoubledDocuments() {
  logger.log(`cleanDoubledDocuments`);

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  logger.log(`${documents.length} documents found. Searching for doublons...`);

  const documentsChecked: documentType[] = [];
  const documentsToDelete: documentType[] = [];
  for (let index = 0, l = documents.length; index < l; index++) {
    const currentDocument = documents[index];
    if (
      documentsChecked.some((documentChecked) =>
        areDocumentsIdentical(documentChecked, currentDocument),
      )
    ) {
      documentsToDelete.push(currentDocument);
    } else {
      documentsChecked.push(currentDocument);
    }
  }

  logger.log(
    `Found ${documentsToDelete.length} documents to delete. Deleting...`,
  );

  for (let index = 0, l = documentsToDelete.length; index < l; index++) {
    await documentService.deleteDocument(documentsToDelete[index]._id);
  }
  logger.log('cleanDoubledDocuments done!');
}

function areDocumentsIdentical(
  document1: documentType,
  document2: documentType,
) {
  return (
    document1.documentNumber === document2.documentNumber &&
    document1.source === document2.source &&
    document1.text === document2.text
  );
}
