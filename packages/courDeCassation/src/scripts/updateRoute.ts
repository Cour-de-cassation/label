import yargs from 'yargs';
import { buildBackend, buildDocumentRepository, logger } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { documentType } from '@label/core';
import { extractRoute } from '../connector/mapper/extractors';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { status } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => updateRoute(status), {
    shouldLoadDb: true,
  });
})();

async function updateRoute(status: documentType['status']) {
  logger.log(`Update route of documents with status ${status}`);

  const documentRepository = buildDocumentRepository();

  const documentsToUpdate = await documentRepository.findAllByStatus([status]);
  logger.log(`${documentsToUpdate.length} documents to update route`);

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
    logger.log(
      `New route for the document ${documentsToUpdate[index]._id} : ${newRoute}`,
    );

    await documentRepository.updateRouteById(
      documentsToUpdate[index]._id,
      newRoute,
    );
  }
}

function parseArgv() {
  const argv = yargs
    .option({
      status: {
        demandOption: true,
        description: 'status of the document you want to update route',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    status: argv.status as documentType['status'],
  };
}
