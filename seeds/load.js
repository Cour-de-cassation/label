const { MongoClient } = require('mongodb')
const { readFile, readdir } = require('fs/promises')
const { statSync } = require('fs')
const { resolve } = require('path')
if (!process.env.NODE_ENV) require('dotenv')

async function readDbNames() {
  const pathes = await readdir(resolve(__dirname))
  return pathes.filter((_) => statSync(resolve(__dirname, _)).isDirectory())
}

async function readCollectionNames(dbName) {
  const files = await readdir(resolve(__dirname, dbName))
  return files.map((_) => ({
    dbName,
    collectionName: _.slice(0, _.length - '.json'.length),
    path: resolve(__dirname, dbName, _)
  }))
}

async function saveCollections(client, { dbName, collectionName, path }) {
  const collection = await client.db(dbName).createCollection(collectionName)
  const save = await readFile(path, 'utf8')
  const saveParse = JSON.parse(save)

  if (saveParse.length <= 0) return
  return collection.insertMany(saveParse)

}

async function main() {
  const client = new MongoClient(process.env.LABEL_DB_URL)
  await client.connect()

  const dbNames = await readDbNames()
  const collections = (await Promise.all(dbNames.map(readCollectionNames))).flat()

  return Promise.all(collections.map(_ => saveCollections(client, _)))
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit())
