import { scriptRunner } from '@label/backend';
import { jurinetConnector } from '../connector';

scriptRunner.run(importAllDocumentsFromJurinet, { shouldLoadDb: true });

async function importAllDocumentsFromJurinet() {
  await jurinetConnector.importAllDocuments();
}
