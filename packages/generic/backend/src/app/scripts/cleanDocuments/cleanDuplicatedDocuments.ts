import { documentType } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanDuplicatedDocuments };

/**
 * Delete all doubled documents (same externalId) and keep the most recent document by dateCreation
 */
async function cleanDuplicatedDocuments() {
  logger.log({ operationName: 'cleanDuplicatedDocuments', msg: 'START' });

  const documentRepository = buildDocumentRepository();

  const documents = (await documentRepository.findAll()).filter(
    (doc) => doc.status !== 'rejected',
  );

  logger.log({
    operationName: 'cleanDuplicatedDocuments',
    msg: `${documents.length} documents found. Searching for duplicates...`,
  });

  const documentsByExternalId = new Map<string, documentType[]>();

  for (const document of documents) {
    if (!documentsByExternalId.has(document.externalId)) {
      documentsByExternalId.set(document.externalId, []);
    }
    documentsByExternalId.get(document.externalId)!.push(document);
  }

  const documentsToDelete: documentType[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, docs] of documentsByExternalId.entries()) {
    if (docs.length > 1) {
      docs.sort((a, b) => {
        if (a.creationDate && b.creationDate) {
          return a.creationDate > b.creationDate ? -1 : 1;
        }
        return 1;
      });
      // keep only the most recent doc
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...duplicates] = docs;
      documentsToDelete.push(...duplicates);
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
