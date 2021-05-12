import { buildBackend } from '@label/backend';
import { buildNlpAnnotator } from '../annotator';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => reAnnotateUntreatedDocumentsWithNlp(settings), {
    shouldLoadDb: true,
  });
})();

async function reAnnotateUntreatedDocumentsWithNlp(settings: string) {
  const nlpAnnotator = buildNlpAnnotator(settings);

  await nlpAnnotator.reAnnotateUntreatedDocuments();
}
