import { uniq } from 'lodash';
import { documentService } from '../../../modules/document';
import { buildDocumentRepository } from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanLoadedDocuments };

/**
 * Reset all documents that are either loaded or nlpAnnotating
 */
async function cleanLoadedDocuments() {
  logger.log({ operationName: 'cleanLoadedDocuments', msg: 'START' });

  const documentRepository = buildDocumentRepository();

  logger.log({
    operationName: 'cleanLoadedDocuments',
    msg: 'Fetching "loaded" documents',
  });
  const loadedDocuments = await documentRepository.findAllByStatusProjection(
    ['loaded'],
    ['_id'],
  );

  logger.log({
    operationName: 'cleanLoadedDocuments',
    msg: `${loadedDocuments.length} loaded documents found`,
  });

  const loadedDocumentsIds = loadedDocuments.map(({ _id }) => _id);

  for (let i = 0, length = loadedDocumentsIds.length; i < length; i++) {
    await documentService.resetDocument(loadedDocumentsIds[i]);
  }

  logger.log({
    operationName: 'cleanLoadedDocuments',
    msg: `"loaded" documents reset. Fetching non-treated documents...`,
  });
  const notTreatedDocuments = await documentService.fetchDocumentsWithoutAnnotations();
  logger.log({
    operationName: 'cleanLoadedDocuments',
    msg: `${
      notTreatedDocuments.length
    } not treated documents found. Status are [${uniq(
      notTreatedDocuments.map(({ status }) => status),
    ).join(', ')}]. Setting status to loaded...`,
  });

  for (let i = 0, length = notTreatedDocuments.length; i < length; i++) {
    await documentService.updateDocumentStatus(
      notTreatedDocuments[i]._id,
      'loaded',
    );
  }

  logger.log({ operationName: 'cleanLoadedDocuments', msg: 'DONE' });
}
