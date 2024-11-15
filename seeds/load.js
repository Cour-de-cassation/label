const { MongoClient, ObjectId } = require("mongodb");
const { readFile, readdir } = require("fs/promises");
const { resolve } = require("path");
if (!process.env.NODE_ENV) require("dotenv");

async function readCollectionNames(dbName) {
  const files = await readdir(resolve(__dirname, dbName));
  return files.map((_) => ({
    dbName,
    collectionName: _.slice(0, _.length - ".json".length),
    path: resolve(__dirname, dbName, _),
  }));
}

async function saveCollections(client, { dbName, collectionName, path }) {
  const collection = await client.db(dbName).createCollection(collectionName);
  const save = await readFile(path, "utf8");
  const saveParse = JSON.parse(save, (_, value) => {
    if (value && typeof value["$oid"] === "string" && value["$oid"].length > 0)
      return ObjectId(value["$oid"]);
    return value;
  });
  if (saveParse.length <= 0) return;
  return collection.insertMany(saveParse);
}

async function main() {
  const client = new MongoClient(process.env.LABEL_DB_URL, {
    useUnifiedTopology: true,
  });
  await client.connect();

  const collections = await readCollectionNames(process.env.LABEL_DB_NAME);

  return Promise.all(collections.map((_) => saveCollections(client, _)));
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit());
