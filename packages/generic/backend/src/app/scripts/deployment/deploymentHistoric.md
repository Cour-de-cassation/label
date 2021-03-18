# Deployment historic

This document sums up the scripts run in pre-production and production

## Pre-production

- [x] renamePasswordToHashedPasswordInUserModel
- [ ] addPublicationCategoryInDocumentModel

## Production

# Use

## What to do when updating the data model

- create a migration file entitled "{verb}{fields}In{documentName}Model" where `verb` is `add`/`remove`/`rename`, `fields` is the field(s) you want to have a action on, and `documentName` the data model you want to update
- write a test
- add the migration function you implemented in `index.ts`

## What to do when running the deployment script

- tick the corresponding check in the environment you deployed to
- move to the `deprecated` folder the run migration(s) function(s)