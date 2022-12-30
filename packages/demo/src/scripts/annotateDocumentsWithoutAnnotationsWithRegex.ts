import { buildBackend } from '@label/backend';
import { settingsType } from '@label/core';
import { buildRegexAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  backend.runScript(
    () => annotateDocumentsWithoutAnnotationsWithRegex(settings),
    {
      shouldLoadDb: true,
    },
  );
})();

async function annotateDocumentsWithoutAnnotationsWithRegex(
  settings: settingsType,
) {
  const regexAnnotator = buildRegexAnnotator(settings);

  await regexAnnotator.annotateDocumentsWithoutAnnotations();
}
