const { MongoClient } = require('mongodb')
if (!process.env.NODE_ENV) require('dotenv')

async function main() {
  const client = new MongoClient(process.env.LABEL_DB_URL)
  await client.connect()

  const { databases } = await client.db().admin().listDatabases()
  const dbNames = databases.map(({ name }) => name).filter(_ => _ != 'admin')

  const dbCollections = await Promise.all(dbNames.map((_) => client.db(_).collections()))
  const collections = dbCollections.flat()

  return Promise.all(collections.map((_) => _.drop()))
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit())
