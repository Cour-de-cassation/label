import { buildBackend } from '@label/backend';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  const nlpAnnotator = buildNlpAnnotator(settings, environment);

  backend.runScript(() => nlpAnnotator.fillLossOfAllTreatedDocuments(), {
    shouldLoadDb: true,
  });
})();
