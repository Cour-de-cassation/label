# NLP annotator

The NLP annotator is the interface we have with the NLP engine of the "Cour de Cassation".

## Local version

In order to be able to run LABEL locally, it is possible to use a test dataset stored locally.

To do so, you need to put all your Jurinet court decisions in a folder `./storage/documents` at the root of the
package. The court decisions should be in the jurinet xml format. Their name should be `${idOfTheCourtDecision}.xml`.

To do so, you need to put all your annotations in a folder `./storage/annotations` at the root of the
package. The annotations should be in our nlp engine format. Their name should be `${idOfTheCourtDecision}.json`
(to be able to link them to the corresponding court decision).

To run the local version of the annotator, you have to use node with the proper environment variable set `RUN_MODE=LOCAL`.

# Troubleshooting

## There is no document left to annotate

To import _count_ new documents in the LABEL database:

- Connect to Wallix and open a Cygwin term
- `prod label script importNewDocumentsFromSder --count=1000 --threshold=1000`
- `prod label script annotateDocumentsWithoutAnnotationsWithNlp`

## A jurinet decision should have been released in open data, but we cannot find it anywhere via the Judifiltre search engine

- Ask for the _jurinet ID_. If you're only provided with a _numéro de registre_, you won't be able to find it in the database.
- Search for it in the _SDER_ database, _rawJurinet_ table
  - connect to `dbsder-pp` (preprod, resp `dbsder`: prod) via ssh and connect to the Mongo db
  - `use SDER`
  - `db.rawJurinet.find({_id: ID_JURINET})`
- => if the decision is not in the _rawJurinet_ table, ask Sébastien Courvoisier to import it
- search for it in the _SDER_ database, _decisions_ table
  - `db.decisions.find({sourceName: "jurinet", sourceId: ID_JURINET})`
- => if the decision is not in the _decisions_ table, ask Sébastien Courvoisier to import it
- => if the decision is in the _decisions_ table, if its `labelStatus` is `done` or `exported` and its `pseudoText` is not null, ask Sébastien Courvoisier why the decision has not been released to the Judifiltre API
- => if the decision is in the _decisions_ table and its `labelStatus` is `toBeTreated` :
  - connect to Wallix and open a Cygwin term
  - preprod:
    - `pp label script importSpecificDocumentFromSder.js --documentNumber=JURINET_ID source="jurinet"`
    - `pp label script annotateDocumentsWithoutAnnotationsWithNlp.js`
  - prod:
    - `prod label script importSpecificDocumentFromSder.js --documentNumber=JURINET_ID source="jurinet"`
    - `prod label script annotateDocumentsWithoutAnnotationsWithNlp.js`
- Once the document is imported in LABEL, you can check its status with the following instructions:
  - connect to `dbsder-pp` (resp `dbsder` for prod) via ssh and connect to the Mongo db
  - `use labelDb`
  - `db.documents.find({documentNumber: ID_JURINET, source: "jurinet"})`

## Logs and more things

In order to accelerate use of shortcuts, scripts are included in Wallix/Cygwin shell: `pp` and `prod`. Both are shortcuts of the `kubectl` command, linked to correct kube config (thus kube cluster), and correct namespace

#### Running logs

```shell
prod label logs -f deployment.apps/label-backend-deployment
```

#### Get the pods of Label namespace

```shell
prod get pods
```

### Go into the container

```shell
pp label exec -i deployment.apps/label-backend-deployment -- /bin/sh
```
