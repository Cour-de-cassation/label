import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { dateBuilder, logger } from '../../utils';

export { freePendingDocuments };

async function freePendingDocuments(minutesBeforeFreeing: number) {
  logger.log(`freePendingDocuments ${minutesBeforeFreeing}`);

  const documentRepository = buildDocumentRepository();

  logger.log('Fetching pending documents');
  const pendingDocuments = await documentRepository.findAllByStatusProjection(
    ['pending'],
    ['_id', 'updateDate'],
  );
  logger.log(`${pendingDocuments.length} documents fetched`);
  const pendingDocumentsToFree = pendingDocuments.filter(
    (document) =>
      document.updateDate <= dateBuilder.minutesAgo(minutesBeforeFreeing),
  );
  logger.log(`${pendingDocumentsToFree.length} documents to free`);

  for (let index = 0; index < pendingDocumentsToFree.length; index++) {
    logger.log(
      `Freeing document ${index + 1}/${pendingDocumentsToFree.length}`,
    );
    await documentService.updateDocumentStatus(
      pendingDocumentsToFree[index]._id,
      'free',
    );
  }

  logger.log('Done');
}
