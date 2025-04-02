const { MongoClient, ObjectId } = require("mongodb");
const { readFile, readdir } = require("fs/promises");
const { resolve } = require("path");
if (!process.env.NODE_ENV) require("dotenv").config();

async function readCollections() {
  const path = resolve(__dirname, "db");
  const files = await readdir(path);
  return files.map((_) => ({
    collectionName: _.slice(0, _.length - ".json".length),
    path: resolve(path, _),
  }));
}

async function saveCollections(client, { collectionName, path }) {
  const collection = await client.db().createCollection(collectionName);
  const save = await readFile(path, "utf8");
  const saveParse = JSON.parse(save, (_, value) => {
    if (value && typeof value["$oid"] === "string" && value["$oid"].length > 0)
      return ObjectId(value["$oid"]);
    if (
      value &&
      typeof value["$date"] === "string" &&
      value["$date"].length > 0
    )
      return new Date(value["$date"]);
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

  const collections = await readCollections();

  return Promise.all(collections.map((_) => saveCollections(client, _)));
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit());
