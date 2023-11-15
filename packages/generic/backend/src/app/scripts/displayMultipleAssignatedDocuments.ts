import { idModule } from 'sder';
import { logger } from '../../utils';
import { assignationService } from '../../modules/assignation';
import { buildDocumentRepository } from '../../modules/document';
import { userService } from '../../modules/user';

export { displayMultipleAssignatedDocuments };

async function displayMultipleAssignatedDocuments() {
  logger.log({
    operationName: 'displayMultipleAssignatedDocuments',
    msg: 'START',
  });
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();

  let documentCount = 0;
  for (const document of documents) {
    const assignations = await assignationService.fetchAssignationsOfDocumentId(
      document._id,
    );
    const usersByAssignationId = await userService.fetchUsersByAssignations(
      assignations,
    );
    const userNames = assignations
      ? assignations.map(
          (assignation) =>
            usersByAssignationId[idModule.lib.convertToString(assignation._id)]
              .name,
        )
      : [];
    if (userNames.length > 1) {
      documentCount++;
      logger.log({
        operationName: 'displayMultipleAssignatedDocuments',
        msg: `${document.documentNumber} (${document.source}) has ${
          userNames.length
        } assignated: [${userNames.join(', ')}]`,
      });
    }
  }
  logger.log({
    operationName: 'displayMultipleAssignatedDocuments',
    msg: `${documentCount} documents found`,
  });
  logger.log({
    operationName: 'displayMultipleAssignatedDocuments',
    msg: 'DONE',
  });
}
