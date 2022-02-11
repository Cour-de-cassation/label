import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';

export { displayMultipleAssignatedDocuemnts };

async function displayMultipleAssignatedDocuemnts() {
  logger.log(`displayMultipleAssignatedDocuemnts`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();

  let documentCount = 0;
  for (const document of documents) {
    const { viewerNames } = document.reviewStatus;
    if (viewerNames.length > 1) {
      documentCount++;
      logger.log(
        `${document.documentNumber} (${document.source}) has ${
          viewerNames.length
        } reviewers: [${viewerNames.join(', ')}]`,
      );
    }
  }
  logger.log(`${documentCount} documents found.`);
  logger.log(`DONE displayMultipleAssignatedDocuemnts`);
}
