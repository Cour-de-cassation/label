import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';
import { logger } from '@label/backend';
import * as dotenv from 'dotenv';

(async () => {
  if (process.env.RUN_MODE === 'LOCAL') {
    dotenv.config();
  }
  const { settings } = await parametersHandler.getParameters();
  const { fromDaysAgo, toDaysAgo, byDateCreation } = parseArgv();
  const backend = buildBackend(settings);

  backend.runScript(
    () =>
      importAllDocumentsFromSderSinceOrBetween(
        fromDaysAgo,
        byDateCreation,
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
  toDaysAgo?: number,
) {
  if (toDaysAgo) {
    if (fromDaysAgo >= toDaysAgo) {
      await sderConnector.importDocumentsSinceOrBetween({
        fromDaysAgo,
        toDaysAgo,
        byDateCreation,
      });
    } else {
      logger.error({
        operationName: 'importAllDocumentsFromSderSinceOrBetween',
        msg: `Argument fromDaysAgo (${fromDaysAgo}) is less than toDaysAgo (${toDaysAgo}), aborting.`,
      });
    }
  } else {
    await sderConnector.importDocumentsSinceOrBetween({
      fromDaysAgo,
      byDateCreation,
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
    fromDaysAgo: argv.fromDaysAgo as number,
    toDaysAgo: argv.toDaysAgo as number,
    byDateCreation: !!argv.byDateCreation as boolean,
  };
}
