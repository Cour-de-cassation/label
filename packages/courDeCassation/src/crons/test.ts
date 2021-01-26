import { buildBackend } from '@label/backend';
import { nlpFetcher } from '../annotator/fetcher';
import { sderFetcher } from '../connector/fetcher';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(test, { shouldLoadDb: false });
})();

async function test() {
  const documents = await sderFetcher.fetchAllDocuments();
  console.log(documents.map(document => document._id));
  console.log(`${documents.length} documents fetched`);

  for (let ind = 0; ind < documents.length; ind++) {
    const { annotations } = await nlpFetcher.fetchAnnotationOfDocument(
      documents[ind],
    );
    console.log(
      `Document ${ind + 1}/${documents.length} annotated (${
        annotations.length
      } annotations found)`,
    );
  }
}
