import { dateBuilder, documentModule } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { logger } from '../../utils';

export { freePendingDocuments };

async function freePendingDocuments() {
  logger.log({ operationName: 'freePendingDocuments', msg: 'START' });

  const documentRepository = buildDocumentRepository();

  logger.log({
    operationName: 'freePendingDocuments',
    msg: 'Fetching pending documents',
  });
  const pendingDocuments = await documentRepository.findAllByStatusProjection(
    ['pending'],
    ['_id', 'updateDate'],
  );
  logger.log({
    operationName: 'freePendingDocuments',
    msg: `${pendingDocuments.length} documents fetched`,
  });
  const minutesBeforeFreeing = documentModule.lib.getMinutesBeforeFreeingPendingDocuments();
  const pendingDocumentsToFree = pendingDocuments.filter(
    (document) =>
      document.updateDate <= dateBuilder.minutesAgo(minutesBeforeFreeing),
  );
  logger.log({
    operationName: 'freePendingDocuments',
    msg: `${pendingDocumentsToFree.length} documents to free`,
  });

  for (let index = 0; index < pendingDocumentsToFree.length; index++) {
    logger.log({
      operationName: 'freePendingDocuments',
      msg: `Freeing document ${index + 1}/${pendingDocumentsToFree.length}`,
    });
    await documentService.updateDocumentStatus(
      pendingDocumentsToFree[index]._id,
      'free',
    );
  }

  logger.log({ operationName: 'freePendingDocuments', msg: 'DONE' });
}
