import { dateBuilder, logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';

export { freePendingDocuments };

const MINUTES_BEFORE_FREEING = 15;

async function freePendingDocuments() {
  const documentRepository = buildDocumentRepository();

  logger.log('Fetching pending documents');
  const pendingDocuments = await documentRepository.findAllByStatus('pending');
  logger.log(`${pendingDocuments.length} documents fetched`);
  const pendingDocumentsToFree = pendingDocuments.filter(
    (document) =>
      document.updateDate <= dateBuilder.minutesAgo(MINUTES_BEFORE_FREEING),
  );
  logger.log(`${pendingDocumentsToFree.length} documents to free`);

  for (let index = 0; index < pendingDocumentsToFree.length; index++) {
    logger.log(
      `Freeing document ${index + 1}/${pendingDocumentsToFree.length}`,
    );
    documentRepository.updateStatusById(
      pendingDocumentsToFree[index]._id,
      'free',
    );
  }

  logger.log('Done');
}
