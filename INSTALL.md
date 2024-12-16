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
### SSO configuration
Follow the [installation guide](packages/generic/sso/README.md).


>The LABEL application leverages the SSO module as a dependency for its integration with the Single Sign-On (SSO) system. The details of this integration are documented in the [README](packages/generic/sso/README.md) of the SSO module.

The backend exposes the following URLs to interact with the SSO:

1. /api/sso/login: Endpoint to initiate the login process via SSO.
2. /api/sso/acs: Endpoint for processing SAML assertions following a successful authentication.
3. /api/sso/logout: Endpoint to disconnect the user from the SSO.

***The attributes returned by the SSO, as well as the roles used by the application, are specified in the configuration file.***