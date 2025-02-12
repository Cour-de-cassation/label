# Installation guide

## Requirements

- NodeJs v16, you can use `nvm` to use the version specify in the `.nvmrc` file.

## Configuration

You can lauch the backend with or withour docker. To configure each of these methods you must have 2 different env file :

- `docker.env`
- `.env`

Copy and rename `docker.env.example` and `.env.example`.

Label depends on one other service from the Cour de cassation : [dbsder-api](https://github.com/cour-de-cassation/dbsder-api). This API is used to import and export decisions in label.

## Installation and lauch

Install dependencies with:

```sh
yarn
```

### Frontend

To lauch the frontend run:

```sh
yarn start:client:dev
```

Then, on your web browser, open http://localhost:55432

### Backend

#### With docker:

Build the backend with:

```sh
yarn docker:build:backend
```

Start the backend with:

```sh
yarn docker:start:backend
```

#### Without docker:

Start the database:

```sh
yarn docker:start:db
```

Start the backend:

```sh
yarn start:backend:dev
```

### Database

You can init/load/clean database with seeds scripts :

- clean the database : `node seeds/clean.js`
- load fake data in all collections : `node seeds/load.js`
- save your current database data on seeds : `node seeds/save.js`
- refresh date to a recent date : `node seeds/refreshDate.js <timestamp>`

This script is lauch with the `.env` configuration.

### Launch scripts

Label contains many scripts, they are listed [here](docs/scripts.md)
You can launch scripts with theses commands :

#### With docker

```sh
docker container exec -it label-backend-1 sh -c "cd packages/courDeCassation; sh scripts/runLocalScript.sh ./dist/scripts/myScript.js --myArgument"
```

#### Without docker

```sh
scripts/runScriptLocally.sh "myScript.js --myArgument"
```
