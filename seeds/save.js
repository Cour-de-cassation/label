const { MongoClient } = require("mongodb");
const { writeFile } = require("fs/promises");
const { existsSync, mkdirSync } = require("fs");
const { resolve } = require("path");
if (!process.env.NODE_ENV) require("dotenv").config();

async function exportCollection(collection) {
  const { collectionName, dbName } = collection;
  const raw = await collection.find().toArray();
  const dirPath = resolve(__dirname, dbName);

  if (!existsSync(dirPath)) mkdirSync(dirPath);

  return writeFile(
    resolve(dirPath, `${collectionName}.json`),
    JSON.stringify(raw, null, 2),
    "utf8"
  );
}

async function main() {
  const client = new MongoClient(process.env.LABEL_DB_URL, { useUnifiedTopology: true });
  await client.connect();

  const dbCollections = await client.db(process.env.LABEL_DB_NAME).collections();
  const collections = dbCollections.flat();

  return Promise.all(collections.map(exportCollection));
}

main()
  .catch(console.error)
  .finally((_) => process.exit());
