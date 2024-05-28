import { buildBackend } from '@label/backend';
import { settingsType } from '@label/core';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  backend.runScript(() => reAnnotateFreeDocumentsWithNlp(settings), {
    shouldLoadDb: true,
  });
})();

async function reAnnotateFreeDocumentsWithNlp(settings: settingsType) {
  const nlpAnnotator = buildNlpAnnotator(settings);

  await nlpAnnotator.reAnnotateFreeDocuments();
}
