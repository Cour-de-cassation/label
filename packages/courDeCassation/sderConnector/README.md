# Jurinet connector

The Jurinet connector is the interface we have with the Jurinet Database.

## Importation

To import all the documents from Jurinet, run the following cron: `./src/crons/importAllDocumentsFromJurinet.ts`

## Local version

In order to be able to run LABEL locally, it is possible to use a test dataset stored locally.
To do so, you need to put all your Jurinet court decisions in a folder `./storage/` at the root of the
package. The court decisions should be in the jurinet xml format. Their name should be `${idOfTheCourtDecision}.xml`.

To run the local version of the connector, you have to use node with the proper environment variable set `RUN_MODE=LOCAL`.
