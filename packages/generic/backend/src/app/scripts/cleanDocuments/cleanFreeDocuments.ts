import { assignationService } from '../../../modules/assignation';
import { buildDocumentRepository } from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanFreeDocuments };

/**
 * Delete all assignations for free documents
 */
async function cleanFreeDocuments() {
  logger.log({ operationName: 'cleanFreeDocuments', msg: 'START' });

  const documentRepository = buildDocumentRepository();

  const freeDocuments = await documentRepository.findAllByStatusProjection(
    ['free'],
    ['_id'],
  );
  logger.log({
    operationName: 'countFreeDocuments',
    msg: `${freeDocuments.length} free documents found.`,
    data: { freeDocumentsCount: freeDocuments.length },
  });
  const freeDocumentIds = freeDocuments.map(({ _id }) => _id);
  logger.log({
    operationName: 'cleanFreeDocuments',
    msg: 'Deleting assignations and their treatments for free documents',
  });

  for (let i = 0, length = freeDocumentIds.length; i < length; i++) {
    await assignationService.deleteAssignationsByDocumentId(freeDocumentIds[i]);
  }

  logger.log({ operationName: 'cleanFreeDocuments', msg: 'DONE' });
}
