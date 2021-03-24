import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { filename } = parseArgv();

  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.extractMonitoringEntriesIntoCsv.run({ filename }),
    backend.scripts.extractMonitoringEntriesIntoCsv.option,
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      filename: {
        demandOption: true,
        description: 'Name of the written CSV file',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    filename: argv.filename as string,
  };
}
