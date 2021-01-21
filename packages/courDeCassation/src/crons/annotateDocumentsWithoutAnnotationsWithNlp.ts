import { buildBackend } from '@label/backend';
import { nlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(annotateDocumentsWithoutAnnotationsWithNlp, {
    shouldLoadDb: true,
  });
})();

async function annotateDocumentsWithoutAnnotationsWithNlp() {
  await nlpAnnotator.annotateDocumentsWithoutAnnotations();
}
