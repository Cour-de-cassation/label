import { buildBackend } from '@label/backend';
import { environmentType, settingsType } from '@label/core';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  backend.runScript(
    () => annotateDocumentsWithoutAnnotationsWithNlp(settings, environment),
    {
      shouldLoadDb: true,
    },
  );
})();

async function annotateDocumentsWithoutAnnotationsWithNlp(
  settings: settingsType,
  environment: environmentType,
) {
  const nlpAnnotator = buildNlpAnnotator(settings, environment);

  await nlpAnnotator.annotateDocumentsWithoutAnnotations();
}
