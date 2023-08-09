# Scripts

Find here the list of available scripts with a brief description. Find options at [`packages/courDeCassation/src/scripts`](https://github.com/Cour-de-cassation/label/tree/dev/packages/courDeCassation/src/scripts).

## annotateDocumentsWithoutAnnotationsWithNlp

Send documents to the NLP API and retreive their annotations.

## autoImportDocumentsFromSder

Import all possible documents from SDER.

## bootstrap

??

## cleanDocuments

Cleaning script (clean duplicated documents and other).

## clearDb

Clear Label database.

## clearDbExceptUsersAndMigrations

Delete all documents related data but keep users and migrations.

## clearDbOnlyProblemReports

Delete all problem reports.

## createMigrationFile

Init migration.

## deleteDocument

Delete specific document from Label db.

## deleteDocumentsOlderThan

Deleted documents older than a specific date from Label db.

## displayDocumentLinks

Count linked documents in Label database (chained documents that are in the same time in Label).

## displayMultipleAssignatedDocuments

Display if documents are assigneted to multiple users (which is a bug).

## dumpDocument

Dump document data in the console.

## exportAllRejectedDocuments

Reject documents with the rejected status (delete document from Label & set 'blocked' status in the SDER database).

## exportAllTreatedDocuments

Export all documents that ahve been treated (without waiting).

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

## importAllDocumentsFromSderBetween

Import documents from the SDER database with jurisdiction and chamber filter between dates.

## importAllDocumentsFromSderSince

Import documents from the SDER database since X days.

## importChainedDocumentsFromSder

Import from the SDER database JuriCA decisions to pseudonymise chained with Jurinet decisions that are in the SDER database.

## importJuricaDocuments

Import from the SDER database recent JuriCA decisions to pseudonymise.

## importJuritjDocuments

Import from the SDER database recent JuriTJ decisions to pseudonymise.


## importNewDocumentsFromSder

Same as `autoImportDocumentsFromSder`, but without the `threshold` option.

## importSpecificDocumentFromSder

Manual import of a specific document.

## importTestDocumentsFromSderSince

Manual import of documents for testing.

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

Purge db (for now only the statistics after 6 months).

## reAnnotateFreeDocuments

If the NLP API was outdated or buggy, reannotate free documents. Warning: this script has not been tested since a while (possible bug: treatments are not deleted).

## renewCache

Renew the cache.

## resetAllDocumentsSince

Reset documents since a specific date.

## resetAllLockedDocuments

Reset locked documents.

## resetDocument

Reset a specific document.

## resetUntreatedDocumentsForTest

## revertOneMigration

Revert a migration.

## runNewMigrations

Run migrations.
