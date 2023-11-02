import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { sderConnector } from '../connector';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => sderConnector.resetAllDocumentsSince({ days, environment }),
    {
      shouldLoadDb: true,
    },
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      days: {
        demandOption: true,
        description: 'imported since days',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { days: argv.days as number };
}
