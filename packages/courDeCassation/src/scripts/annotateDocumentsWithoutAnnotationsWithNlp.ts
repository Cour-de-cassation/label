import { buildBackend } from '@label/backend';
import { environmentType, settingsType } from '@label/core';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';
import * as dotenv from 'dotenv';

(async () => {
  if (process.env.RUN_MODE === 'LOCAL') {
    dotenv.config();
  }
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
