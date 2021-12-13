import { idModule } from '@label/core';
import { buildAssignationRepository } from '../../../modules/assignation';
import {
  documentService,
  buildDocumentRepository,
} from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanAssignedDocuments };

async function cleanAssignedDocuments() {
  logger.log(`cleanAssignedDocuments`);
  const documentRepository = buildDocumentRepository();
  const assignedDocuments = await documentRepository.findAllByStatusProjection(
    ['pending', 'saved'],
    ['_id', 'status'],
  );

  const assignationRepository = buildAssignationRepository();
  const assignations = await assignationRepository.findAllProjection([
    '_id',
    'documentId',
  ]);

  logger.log(`Start checking all assigned documents`);

  await Promise.all(
    assignedDocuments.map(async (document) => {
      const assignation = assignations.find(({ documentId }) =>
        idModule.lib.equalId(documentId, idModule.lib.buildId(document._id)),
      );
      if (!assignation) {
        logger.log(
          `Inconsistency: assignation not found for document status ${document.status}. Resetting the document to free...`,
        );
        await documentService.updateDocumentStatus(document._id, 'free');
      }
      return;
    }),
  );
  logger.log(`cleanAssignedDocuments done!`);
}
