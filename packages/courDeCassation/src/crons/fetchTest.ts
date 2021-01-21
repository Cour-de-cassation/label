import { buildBackend } from '@label/backend';
import { sderFetcher } from '../connector/fetcher';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(fetchTest, { shouldLoadDb: false });
})();

async function fetchTest() {
  const documents = await sderFetcher.fetchAllDocuments();
  console.log(documents.map(document => document._id));
  console.log(`${documents.length} documents fetched`);
}
