import { buildBackend, buildDocumentRepository, logger } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { extractRoute } from '../connector/mapper/extractors';
import * as readline from 'readline';

(async () => {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const { environment, settings } = await parametersHandler.getParameters();
  prompt.question(
    'Confirmez vous le lancement de ce script (yes/no)? ',
    (answer: any) => {
      if (answer == 'yes') {
        const backend = buildBackend(environment, settings);
        backend.runScript(() => updateRouteForFreeDocuments(), {
          shouldLoadDb: true,
        });
      } else {
        logger.log({
          operationName: 'updateRouteForFreeDocuments',
          msg: `updateRouteForFreeDocuments script is canceled`,
        });
      }
      prompt.close();
    },
  );
})();

async function updateRouteForFreeDocuments() {
  logger.log({
    operationName: 'updateRouteForFreeDocuments',
    msg: `Update route of documents with status Free`,
  });

  const documentRepository = buildDocumentRepository();

  const documentsToUpdate = await documentRepository.findAllByStatus(['free']);
  logger.log({
    operationName: 'updateRouteForFreeDocuments',
    msg: `${documentsToUpdate.length} documents to update route`,
  });

  for (let index = 0; index < documentsToUpdate.length; index++) {
    const newRoute = extractRoute(
      {
        additionalTermsToAnnotate:
          documentsToUpdate[index].decisionMetadata.additionalTermsToAnnotate,
        session: documentsToUpdate[index].decisionMetadata.session,
        solution: documentsToUpdate[index].decisionMetadata.solution,
        parties: documentsToUpdate[index].decisionMetadata.parties,
        publicationCategory: documentsToUpdate[index].publicationCategory,
        chamberName: documentsToUpdate[index].decisionMetadata.chamberName,
        civilMatterCode:
          documentsToUpdate[index].decisionMetadata.civilMatterCode,
        civilCaseCode: documentsToUpdate[index].decisionMetadata.civilCaseCode,
        criminalCaseCode:
          documentsToUpdate[index].decisionMetadata.criminalCaseCode,
        NACCode: documentsToUpdate[index].decisionMetadata.NACCode,
        endCaseCode: documentsToUpdate[index].decisionMetadata.endCaseCode,
      },
      documentsToUpdate[index].source,
    );
    logger.log({
      operationName: 'updateRouteForFreeDocuments',
      msg: `New route for the document ${documentsToUpdate[index]._id} : ${newRoute}`,
    });

    await documentRepository.updateRouteById(
      documentsToUpdate[index]._id,
      newRoute,
    );
  }
}
