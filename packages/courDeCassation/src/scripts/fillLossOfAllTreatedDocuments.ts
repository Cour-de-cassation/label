import { buildBackend } from '@label/backend';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);
  const nlpAnnotator = buildNlpAnnotator(settings);

  backend.runScript(() => nlpAnnotator.fillLossOfAllTreatedDocuments(), {
    shouldLoadDb: true,
  });
})();
