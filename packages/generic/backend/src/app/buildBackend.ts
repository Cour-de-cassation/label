import { settingsType } from '@label/core';
import { buildRunScript } from './buildRunScript';
import { buildRunServer } from './buildRunServer';
import {
  cleanDocuments,
  clearDb,
  deleteDocument,
  displayDocumentLinks,
  displayMultipleAssignatedDocuments,
  dumpDocument,
  freePendingDocuments,
  insertTestStatistics,
  insertTestUsers,
  listAllDocuments,
  listAllCaches,
  listDocumentsWithProblemReports,
  purgeDb,
  renewCache,
  resetUntreatedDocumentsForTest,
} from './scripts';
import { cleanDuplicatedDocuments } from './scripts/cleanDocuments';

export { buildBackend };

function buildBackend(settings: settingsType) {
  const runServer = buildRunServer(settings);
  const runScript = buildRunScript();

  return {
    runServer,
    runScript,
    scripts: {
      cleanDocuments: {
        run: cleanDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      clearDb: {
        run: clearDb,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      deleteDocument: {
        run: deleteDocument,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      displayDocumentLinks: {
        run: displayDocumentLinks,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      displayMultipleAssignatedDocuments: {
        run: displayMultipleAssignatedDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      dumpDocument: {
        run: dumpDocument,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      freePendingDocuments: {
        run: freePendingDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      insertTestStatistics: {
        run: insertTestStatistics,
        option: { shouldLoadDb: true, shouldExit: false },
      },

      insertTestUsers: {
        run: insertTestUsers,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      listAllCaches: {
        run: listAllCaches,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      listAllDocuments: {
        run: listAllDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      listDocumentsWithProblemReports: {
        run: listDocumentsWithProblemReports,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      purgeDb: {
        run: purgeDb,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      renewCache: {
        run: renewCache,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      resetUntreatedDocumentsForTest: {
        run: resetUntreatedDocumentsForTest,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      cleanDuplicatedDocuments: {
        run: cleanDuplicatedDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
    },
  };
}
