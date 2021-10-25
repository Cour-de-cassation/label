import { buildBackend } from '@label/backend';
import { environmentType, settingsType } from '@label/core';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => reAnnotateFreeDocumentsWithNlp(settings, environment),
    {
      shouldLoadDb: true,
    },
  );
})();

async function reAnnotateFreeDocumentsWithNlp(
  settings: settingsType,
  environment: environmentType,
) {
  const nlpAnnotator = buildNlpAnnotator(settings, environment);

  await nlpAnnotator.reAnnotateFreeDocuments();
}
