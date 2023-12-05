import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';
import { environmentType } from '@label/core';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days, byDateCreation } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => importAllDocumentsFromSderSince(days, byDateCreation, environment),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importAllDocumentsFromSderSince(
  days: number,
  byDateCreation: boolean,
  environment: environmentType,
) {
  await sderConnector.importDocumentsSince({
    days,
    byDateCreation,
    environment,
  });
}

function parseArgv() {
  const argv = yargs
    .options({
      days: {
        demandOption: true,
        description: 'created since days',
        type: 'number',
      },
      byDateCreation: {
        demandOption: false,
        description: 'search by date of creation',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    days: argv.days as number,
    byDateCreation: !!argv.byDateCreation as boolean,
  };
}
