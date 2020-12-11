import { scriptRunner } from '@label/backend';
import { sderConnector } from '../connector';

scriptRunner.run(importAllDocumentsFromSder, { shouldLoadDb: true });

async function importAllDocumentsFromSder() {
  await sderConnector.importAllDocuments();
}
