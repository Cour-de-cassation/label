import { buildBackend } from '@label/backend';
import { buildRegexAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  const nlpAnnotator = buildRegexAnnotator(settings);

  backend.runScript(() => nlpAnnotator.fillLossOfAllTreatedDocuments(), {
    shouldLoadDb: true,
  });
})();
