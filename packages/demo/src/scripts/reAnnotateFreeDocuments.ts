import { buildBackend } from '@label/backend';
import { settingsType } from '@label/core';
import { buildRegexAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => reAnnotateFreeDocumentsWithNlp(settings), {
    shouldLoadDb: true,
  });
})();

async function reAnnotateFreeDocumentsWithNlp(settings: settingsType) {
  const nlpAnnotator = buildRegexAnnotator(settings);

  await nlpAnnotator.reAnnotateFreeDocuments();
}
