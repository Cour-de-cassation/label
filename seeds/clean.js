const { MongoClient } = require('mongodb')
if (!process.env.NODE_ENV) require('dotenv').config()

async function main() {
  const client = new MongoClient(process.env.LABEL_DB_URL, { useUnifiedTopology: true })
  await client.connect()

  const dbCollections = await client.db(process.env.LABEL_DB_NAME).collections()
  const collections = dbCollections.flat()

  return Promise.all(collections.map((_) => _.drop()))
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit())
