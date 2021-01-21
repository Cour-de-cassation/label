import { documentModule } from '@label/core';
import { buildBackend } from '@label/backend';
import { nlpFetcher } from '../annotator/fetcher';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(annotatorTest, { shouldLoadDb: false });
})();

async function annotatorTest() {
  const document = documentModule.generator.generate({
    text:
      "Nicolas Assouad est ingénieur en informatique au 5 quaie de l'horloge Paris",
  });
  const {
    annotations,
    documentId,
    report,
  } = await nlpFetcher.fetchAnnotationOfDocument(document);
  console.log('document', document);
  console.log('annotations', annotations);
  console.log('documentId', documentId);
  console.log('report', report);
}
