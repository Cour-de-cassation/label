import { buildBackend } from '@label/backend';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => annotateDocumentsWithoutAnnotationsWithNlp(settings),
    {
      shouldLoadDb: true,
    },
  );
})();

async function annotateDocumentsWithoutAnnotationsWithNlp(settings: string) {
  const nlpAnnotator = buildNlpAnnotator(settings);

  await nlpAnnotator.annotateDocumentsWithoutAnnotations();
}
