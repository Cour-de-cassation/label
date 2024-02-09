import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';
import { environmentType } from '@label/core';
import { logger } from '@label/backend';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { fromDaysAgo, toDaysAgo, byDateCreation } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () =>
      importAllDocumentsFromSderSinceOrBetween(
        fromDaysAgo,
        byDateCreation,
        environment,
        toDaysAgo,
      ),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importAllDocumentsFromSderSinceOrBetween(
  fromDaysAgo: number,
  byDateCreation: boolean,
  environment: environmentType,
  toDaysAgo?: number,
) {
  if (toDaysAgo) {

    if (fromDaysAgo < toDaysAgo) {
      await sderConnector.importDocumentsSinceOrBetween({
        fromDaysAgo,
        toDaysAgo,
        byDateCreation,
        environment,
      });
    } else {
      logger.log({
        operationName: 'importAllDocumentsFromSderSinceOrBetween',
        msg: `importDocumentsSinceOrBetween ${fromDaysAgo} est inferieur à ${toDaysAgo}`,
      });
    }

  } {
    // import documents since days
    await sderConnector.importDocumentsSinceOrBetween({
      fromDaysAgo,
      byDateCreation,
      environment,
    });
  }

}

function parseArgv() {
  const argv = yargs
    .options({
      fromDaysAgo: {
        demandOption: true,
        description: 'created since days',
        type: 'number',
      },
      toDaysAgo: {
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
    fromDaysAgo: argv.days as number,
    toDaysAgo: argv.to as number,
    byDateCreation: !!argv.byDateCreation as boolean,
  };
}
