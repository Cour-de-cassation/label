import { scriptRunner } from '@label/backend';
import { nlpAnnotator } from '../annotator';

scriptRunner.run(annotateDocumentsWithoutAnnotationsWithNlp, {
  shouldLoadDb: true,
});

async function annotateDocumentsWithoutAnnotationsWithNlp() {
  await nlpAnnotator.annotateDocumentsWithoutAnnotations();
}
