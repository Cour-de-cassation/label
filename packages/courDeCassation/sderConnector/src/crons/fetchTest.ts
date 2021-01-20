import { scriptRunner } from '@label/backend';
import { sderFetcher } from '../connector/fetcher';

scriptRunner.run(fetchTest, { shouldLoadDb: false });

async function fetchTest() {
  const documents = await sderFetcher.fetchAllDocuments();
  console.log(documents.map(document => document._id));
  console.log(`${documents.length} documents fetched`);
}
