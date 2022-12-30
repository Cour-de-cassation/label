import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { from, to, jurisdictions, chambers } = parseArgv();
  const backend = buildBackend(environment, settings);

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const jurisdictionsArr = jurisdictions ? jurisdictions.split(',') : [];
  const chambersArr = chambers ? chambers.split(',') : [];

  backend.runScript(
    () =>
      importAllDocumentsFromSderBetween(
        fromDate,
        toDate,
        jurisdictionsArr,
        chambersArr,
      ),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importAllDocumentsFromSderBetween(
  from: Date,
  to: Date,
  jurisdictions: string[],
  chambers: string[],
) {
  await sderConnector.importDocumentsByJurisdictionBetween(
    from,
    to,
    jurisdictions,
    chambers,
  );
}

function parseArgv() {
  const argv = yargs
    .options({
      from: {
        demandOption: true,
        description: 'the first bounding date (YYYY-MM-DD)',
        type: 'string',
      },
      to: {
        demandOption: true,
        description: 'the last bounding date (YYYY-MM-DD)',
        type: 'string',
      },
      jurisdictions: {
        demandOption: false,
        description: 'jurisdictions to filter',
        type: 'string',
      },
      chambers: {
        demandOption: false,
        description: 'chamber id to filter',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    from: argv.from as string,
    to: argv.to as string,
    jurisdictions: argv.jurisdictions as string,
    chambers: argv.chambers as string,
  };
}
