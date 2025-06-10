# Scripts

Find here the list of available scripts with a brief description. Find options at [`packages/courDeCassation/src/scripts`](https://github.com/Cour-de-cassation/label/tree/dev/packages/courDeCassation/src/scripts).

## annotateDocumentsWithoutAnnotationsWithNlp

Send documents to the NLP API and retreive their annotations.

## autoImportDocumentsFromSder

Import all documents to be pseudonymized from SDER.

## cleanDocuments

Cleaning script (clean duplicated documents and other).

## clearDb

Clear Label database.

## clearDbExceptUsers

Delete all documents related data but keep users.

## clearDbOnlyProblemReports

Delete all problem reports.

## deleteDocument

Delete specific document from Label db.

## displayMultipleAssignatedDocuments

Display if documents are assigneted to multiple users (which is a bug).

## dumpDocument

Dump document data in the console.

## exportAllTreatedDocuments

Export all documents that have been treated (without waiting).

## exportSpecificDocument

Export a specific document

## exportTreatedDocumentsSince

Export treated documents (with the 4 days delay).

## exportTreatedPublishableDocuments

Export important "publishable" documents.

## fillLossOfAllTreatedDocuments

Calculate loss of the documents with the NLP API.

## freePendingDocuments

Free documents assignated to an annotator that is AFK after X minutes.

## importSpecificDocumentFromSder

Manual import of a specific document.

## initializeTestDb

Init db with test values (for local only).

## insertUser

Create a new user.

## listAllCaches

List caches.

## listAllDocuments

List documents.

## listDocumentsWithProblemReports

List documents with problem reports.

## purgeDb

Purge db (for now only the users in statistics after 6 months).

## reAnnotateFreeDocuments

If the NLP API was outdated or buggy, reannotate free documents. Warning: suspend nlp-annotation job during this operation to avoid side effects.
This script only prepare documents and set their status to loaded, the next nlp-annotation job will reannotate them.

## renewCache

Renew the cache.

## resetUntreatedDocumentsForTest

Randomise untreated documents, use only in local or in dev env.

## updateRouteForFreeDocuments

Reapply route rules for documents with a specific status.
