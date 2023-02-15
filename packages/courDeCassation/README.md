# Operate Label

## NLP API

The project currently implement an NLP annotator. It is the interface with the internal *Cour de cassation* NLP API.

## Local version

In order to be able to run LABEL locally, it is possible to use a test dataset stored locally.

To do so, you need to use the `./storage` folder and put your documents and annotations in it. The annotation and decision files should have the same ID in their file name in order to be linked.

To run the local version, you have to use node with the proper environment variable set `RUN_MODE=LOCAL` (see the documentation for commands).


## Procedures

### There is no document left to annotate

Label should always import documents. The `autoImportDocumentsFromSder` script imports documents when the Label database is empty. If it is not the case, check that the script is running or ran as expected.

You can always manually import new documents in the LABEL database:

In Wallix, with a Cygwin terminal: 
```
prod label script importNewDocumentsFromSder --count=1000
```

If the annotator is not running (but it should automatically be triggered), you can run:
```
prod label script annotateDocumentsWithoutAnnotationsWithNlp
```


### A decision should have been released in open data, but we cannot find it online

#### Step 1: identify the document

If you do not have the ID of the document but only the decision number (*numéro RG*, *numéro de pourvoi*...), you can use *Judilibre index* to find it. Just enter the document number in the search bar.

If it does not work or if *Judilibre index* is down, you can try to explore the SDER database or use other internal tools to find the document ID. Try to ask colleagues.

Also, identify the source database (*jurinet*, *jurica*...). Warning, the same document ID and/or the same decision number could be in multiple databases.

#### Step 2: check that the decision is not in Label

If it is a recent decision, it is possible that it is still processing in Label. You can search it with the user interface or in the database. If the decision have the status `loaded` or `nlpAnnotating`, you cannot find it with the UI.

In Wallix, with Robo3T, in `dbsder` > `labelDb` > `documents` collection, run with the corresponding references:
```
db.getCollection('documents').find({source:"jurinet",documentNumber:10000})
```

If you find the decision in Label, check its status and why it is not published.

#### Step 3: if you cannot find it in Label, check that the decision is in the SDER database

In Wallix, with Robo3T, in `dbsder` > `SDER` > `decisions` collection, run with the corresponding references:
```
db.getCollection('decisions').find({sourceName:"jurinet",sourceId:10000}
```

If you can find the decision and that its `labelStatus` is `done` or `exported` and its `pseudoText` is not null, it means that the decision has been treated but the publication failed or for some reason the decision has been unpublished.

If you can find the decision and that its `labelStatus` is `toBeTreated`, you can manually import the decision in Label using the command:
```
prod label script importSpecificDocumentFromSder --documentNumber=10000 --source=jurinet
```

#### Step 4: if you cannot find it in the *decisions* table, check *rawJurica* and *rawJurinet*

In Wallix, with Robo3T, in `dbsder` > `SDER` > `rawJurinet` collection, run with the corresponding ID and table:
```
db.getCollection('rawJurinet').find({_id:10000})
```

#### Step 5: if you cannot find it in the SDER database

If you cannot find the decision in the SDER database, it means that it has not been transmitted to us. Maybe the clerk has not set the release date correctly. You can try to ask the IT services to index the decision.


### We need to treat (again or manually) a decision

#### Step 1: identify the document

(Read previous point above)

#### Step 2: check that the request is valid

Check that we are not asking you to manually import a document that has already been imported and failed to be published (refer to previous points above) or that the document is not blocked somewhere.

#### Step 3: manually import the document in Label

In Wallix, with a Cygwin terminal: 
```
prod label script importSpecificDocumentFromSder --documentNumber=10000 --source=jurinet
```

### We need to manually publish a decision

#### Step 1: identify the document

(Read previous point above)

#### Step 2: check that the decision is awaiting to be published in Label

Check that the document is in Label (refer to previous points above) and ready to be published. It should have the status `toBePublished` or `done`. Also check that colleagues (communication, head of service) are fine with publishing the decsision (they may need to have it in Label for writing the summary/title or still proof-reading it).

If the document is not in Label, check its status in the SDER database (refer to previous points above) and that it has been treated by Label. If yes, the publication has failed.

#### Step 3: manually export the document in Label

In Wallix, with a Cygwin terminal: 
```
prod label script exportSpecificDocument --documentNumber=10000 --source=jurinet
```


## Logs and pods

In order to accelerate use of shortcuts, scripts are included in Wallix/Cygwin shell: `pp` and `prod`. Both are shortcuts of the `kubectl` command, linked to correct kube config (thus kube cluster), and correct namespace

#### Running logs

```
prod label logs -f deployment.apps/label-backend-deployment
```

#### Get the pods of Label namespace

```
prod get pods
```

### Go into the container

```
prod label exec -i deployment.apps/label-backend-deployment -- /bin/sh
```
