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

- connect to `label` via ssh
- `sudo su label`
- navigate to `/home/label/label/packages/courDeCassation`
- `./scripts/run[environment]Script.sh ./dist/scripts/importNewDocumentsFromSder.js --count=[count]`

To annotate all the documents that have not been annotated by the NLP engine yet in the database, run the following :

- `./scripts/run[environment]Script.sh ./dist/scripts/annotateDocumentsWithoutAnnotationsWithNlp.js`

## A jurinet decision should have been released in open data, but we cannot find it anywhere via the Judifiltre search engine

- ask for the _jurinet ID_. If you're only provided with a _numéro de registre_, you won't be able to find it in the database.
- search for it in the _SDER_ database, _rawJurinet_ table
  - connect to `dbsder` via ssh and connect to the Mongo db
  - `use SDER`
  - `db.rawJurinet.find({_id: ID_JURINET})`
- => if the decision is not in the _rawJurinet_ table, ask Sébastien Courvoisier to import it
- search for it in the _SDER_ database, _decisions_ table
  - `db.decisions.find({sourceName: "jurinet", sourceId: ID_JURINET})`
- => if the decision is not in the _decisions_ table, ask Sébastien Courvoisier to import it
- => if the decision is in the _decisions_ table, if its `labelStatus` is `done` or `exported` and its `pseudoText` is not null, ask Sébastien Courvoisier why the decision has not been released to the Judifiltre API
- => if the decision is in the _decisions_ table and its `labelStatus` is `toBeTreated` :
  - connect to `label` via ssh
  - `sudo su label`
  - navigate to `/home/label/label/packages/courDeCassation`
  - `./scripts/run[environment]Script.sh ./dist/scripts/importSpecificDocumentFromSder.js --documentNumber=JURINET_ID source="jurinet"`
  - `./scripts/run[environment]Script.sh ./dist/scripts/annotateDocumentsWithoutAnnotationsWithNlp.js`
- once the document is imported in LABEL, you can check its status with the following instructions:
  - connect to `dbsder` via ssh and connect to the Mongo db
  - `use labelDb`
  - `db.documents.find({documentNumber: ID_JURINET, source: "jurinet"})`


## Note: adaptation to docker or kubernetes (k8s)

Migration is running to go to kubernetes. First step is a dockerized env
Status :
- production: use docker (future: k8s)
- pre-prod: neither docker or kubectl (future: k8s)

### with docker
#### run one of the Label scripts
prepend command with :
```
docker exec -it label-backend -- [my-wonderful-command]
```
#### get running logs
```
docker logs -f label-backend
```

### go into the container
```
docker exec -it label-backend /bin/sh
```

### with kubectl (k8s)
#### get the namespaces
```
kubectl get namespaces
```
#### get the pods
```
kubectl -n [namespace] get pods
```

#### run one of the Label scripts
prepend command with :
```
kubectl -n [the-namespace] exec -it [pod/label-backend-...] -- [my-wonderful-command]
```

#### get running logs
```
kubectl -n [the-namespace] logs -f [pod/label-backend-...]
```

### go into the container
```
kubectl -n [the-namespace] logs -f [pod/label-backend-...] -- /bin/sh
```
### copy something from the container
```
kubectl cp [namespace]/[pod/label-backend-...]:[myfile] $pathto/myfile
```
### copy something to the container
Note: the container is readonly, the only place to strore temporary things into it can be `/dev/shm/tmp`.
```
kubectl cp $pathto/myfile [namespace]/[pod/label-backend-...]:/dev/shm/tmp/[myfile]
```
