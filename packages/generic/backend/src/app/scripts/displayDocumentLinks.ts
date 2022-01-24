import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';

export { displayDocumentLinks };

async function displayDocumentLinks() {
  logger.log(`displayDocumentLinks`);
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();

  let boundDocumentCount = 0;
  for (const document of documents) {
    const { boundDecisionDocumentNumbers } = document.decisionMetadata;
    if (boundDecisionDocumentNumbers.length > 0) {
      boundDocumentCount++;
      logger.log(
        `${document.documentNumber} (${
          document.source
        }) is bound to [${boundDecisionDocumentNumbers.join(', ')}]`,
      );
    }
    logger.log(`${boundDocumentCount} documents bound.`);
  }
  logger.log(`DONE displayDocumentLinks`);
}
