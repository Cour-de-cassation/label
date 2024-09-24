import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';
import { idModule } from 'sder';

export { displayDocumentLinks };

async function displayDocumentLinks() {
  logger.log({ operationName: 'displayDocumentLinks', msg: 'START' });
  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();

  let boundDocumentCount = 0;
  for (const document of documents) {
    const { boundDecisionDocumentNumbers } = document.decisionMetadata;
    if (boundDecisionDocumentNumbers.length > 0) {
      const boundDecisionDocumentsInDb: string[] = [];
      boundDecisionDocumentNumbers.forEach(
        async (boundDecisionDocumentNumber) => {
          const boundDecisionDocument = await documentRepository.findById(
            idModule.lib.buildId(boundDecisionDocumentNumber.toString()),
          );
          if (boundDecisionDocument) {
            boundDecisionDocumentsInDb.push(
              idModule.lib.convertToString(boundDecisionDocument._id),
            );
          }
        },
      );
      boundDocumentCount++;
      logger.log({
        operationName: 'displayDocumentLinks',
        msg: `${document.documentNumber} (${
          document.source
        }) is bound to [${boundDecisionDocumentNumbers.join(
          ', ',
        )}] with these in database [${boundDecisionDocumentsInDb.join(', ')}]`,
      });
    }
  }
  logger.log({
    operationName: 'displayDocumentLinks',
    msg: `${boundDocumentCount} documents bound.`,
  });
  logger.log({ operationName: 'displayDocumentLinks', msg: 'DONE' });
}
