import { documentType, idModule } from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../../modules/assignation';
import { buildDocumentRepository } from '../../../modules/document';
import { logger } from '../../../utils';

export { cleanAssignations };

/**
 * Delete all the assignations linked to a document
 * which is either loaded, being annotated by the NLP engine, or free
 */
async function cleanAssignations() {
  logger.log({ operationName: 'cleanAssignations', msg: 'START' });
  const FORBIDDEN_STATUSES_FOR_ASSIGNATED_DOCUMENT: documentType['status'][] = [
    'free',
  ];
  const documentRepository = buildDocumentRepository();
  const assignationRepository = buildAssignationRepository();

  const documents = await documentRepository.findAllProjection([
    '_id',
    'status',
  ]);
  const assignations = await assignationRepository.findAllProjection([
    '_id',
    'documentId',
  ]);
  logger.log({
    operationName: 'cleanAssignations',
    msg: `Start checking all assignations`,
  });

  await Promise.all(
    assignations.map(async (assignation) => {
      const document = documents.find(({ _id }) =>
        idModule.lib.equalId(_id, idModule.lib.buildId(assignation.documentId)),
      );
      if (
        !document ||
        FORBIDDEN_STATUSES_FOR_ASSIGNATED_DOCUMENT.includes(document.status)
      ) {
        logger.log({
          operationName: 'cleanAssignations',
          msg: `Inconsistency: document not found or status inconsistent. Deleting the assignation...`,
        });
        await assignationService.deleteAssignation(assignation._id);
      }
      return;
    }),
  );
  logger.log({ operationName: 'cleanAssignations', msg: 'DONE' });
}
