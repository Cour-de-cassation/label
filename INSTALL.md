# Installation guide

## Requirements

- NodeJs v16, you can use `nvm` to use the version specify in the `.nvmrc` file.

## Configuration

You can lauch the backend with or withour docker. To configure each of these methods you must have 2 different env file :

- `docker.env`
- `.env`

Copy and rename `docker.env.example` and `.env.example`.

Label depends on 2 other services from the Cour de cassation : dbsder-api and nlp-pseudonymisation-api. You can lauch these services locally to simulate operation close to production or you can disable theses services from env files. In this case these 2 services are emulated by Label with the storage folder. To do so, follow the `Add documents you want to annotate` step in the [reuser guide](docs/reuserGuide.md) or just rename the `storage-example` folder to `storage`.

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

You can init database with :

```sh
yarn init:db
```

This script is lauch with the `.env` configuration.

### Launch scripts

You can launch scripts with theses commands :

#### With docker

```sh
docker container exec -it label-backend-1 sh -c "cd packages/courDeCassation; sh scripts/runLocalScript.sh ./dist/scripts/myScript.js --myArgument"
```

#### Without docker

```sh
scripts/runScriptLocally.sh "myScript.js --myArgument"
```

## Troubleshooting

To use mongo, you need to run in your terminal:

```
sudo chmod 666 /var/run/docker.sock
```
