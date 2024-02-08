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
    () =>
      importAllDocumentsFromSderSinceOrBetween(
        days,
        byDateCreation,
        environment,
      ),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importAllDocumentsFromSderSinceOrBetween(
  days: number,
  byDateCreation: boolean,
  environment: environmentType,
  to?: number,
) {
  await sderConnector.importDocumentsSinceOrBetween({
    days,
    to,
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
      to: {
        demandOption: false,
        description: 'to this day',
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
    to: argv.to as number,
    byDateCreation: !!argv.byDateCreation as boolean,
  };
}
