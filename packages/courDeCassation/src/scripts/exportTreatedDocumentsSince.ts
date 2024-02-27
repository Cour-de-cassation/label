import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days } = parseArgv();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.cleanDuplicatedDocuments.run(),
    backend.scripts.cleanDuplicatedDocuments.option,
  );

  const sderExporter = buildSderExporter(environment, settings);
  backend.runScript(
    () => sderExporter.exportTreatedDocumentsSince(days, environment),
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
        description: 'treated since days',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { days: argv.days as number };
}
