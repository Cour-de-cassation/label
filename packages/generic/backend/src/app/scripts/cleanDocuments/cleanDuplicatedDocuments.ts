import { documentType } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanDuplicatedDocuments };

/**
 * Delete all doubled documents (same source, same documentNumber, same text and creationDate ) get recent documents by creationDate
 */
async function cleanDuplicatedDocuments() {
  logger.log({ operationName: 'cleanDuplicatedDocuments', msg: 'START' });

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();
  const sortedDocuments = documents.sort(compareDocumentsByStatus);

  logger.log({
    operationName: 'cleanDuplicatedDocuments',
    msg: `${documents.length} documents found. Searching for duplicates...`,
  });

  const documentsToDelete: documentType[] = [];

  for (let index = 0, l = documents.length - 1; index < l; index++) {
    const currentDocument = sortedDocuments[index];
    const nextDocument = sortedDocuments[index + 1];
    // check if document is same, if same return the last version document
    if (areDocumentsIdentical(currentDocument, nextDocument)) {
      if (
        currentDocument.creationDate &&
        nextDocument.creationDate != undefined &&
        currentDocument.creationDate > nextDocument.creationDate
      ) {
        documentsToDelete.push(nextDocument);
      } else {
        documentsToDelete.push(currentDocument);
      }
    }
  }

  logger.log({
    operationName: 'cleanDuplicatedDocuments',
    msg: `Found ${documentsToDelete.length} documents to delete. Deleting...`,
  });

  for (let index = 0, l = documentsToDelete.length; index < l; index++) {
    await documentService.deleteDocument(documentsToDelete[index]._id);
  }
  logger.log({ operationName: 'cleanDuplicatedDocuments', msg: 'DONE' });
}

//
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

function compareDocumentsByStatus(
  document1: documentType,
  document2: documentType,
) {
  const statusToPriorities = {
    loaded: 0,
    nlpAnnotating: 1,
    free: 2,
    pending: 3,
    saved: 4,
    toBePublished: 5,
    done: 6,
    toBeConfirmed: 7,
    locked: 8,
    rejected: 9,
  };

  // comparing source
  if (document1.source < document2.source) {
    return -1;
  } else if (document1.source > document2.source) {
    return 1;
  } else {
    // comparing documentNumber
    if (document1.documentNumber < document1.documentNumber) {
      return -1;
    } else if (document1.documentNumber > document2.documentNumber) {
      return 1;
    } else {
      //comparing text
      if (document1.text < document2.text) {
        return -1;
      } else if (document1.text > document2.text) {
        return 1;
      } else {
        // comparing statuses
        if (
          statusToPriorities[document1.status] <
          statusToPriorities[document2.status]
        ) {
          return 1; // low priority
        } else if (
          statusToPriorities[document1.status] >
          statusToPriorities[document2.status]
        ) {
          return -1; // high priority
        } else {
          return 0;
        }
      }
    }
  }
}
