import { documentModule } from '@label/core';
import { scriptRunner } from '@label/backend';
import { nlpFetcher } from '../annotator/fetcher';

scriptRunner.run(annotatorTest, { shouldLoadDb: false });

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
