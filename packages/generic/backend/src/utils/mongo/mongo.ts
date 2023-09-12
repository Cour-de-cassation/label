import { MongoClient, Collection, Document } from 'mongodb';

export { buildMongo, mongo };

export type { mongoCollectionType };

type mongoCollectionType<T extends Document> = Collection<T>;

const mongo = buildMongo();

function buildMongo() {
  let client: MongoClient | undefined;
  let dbName = '';

  return {
    close,
    initialize,
    getDb,
  };

  async function close() {
    await client?.close();
  }

  async function initialize({
    dbName: newDbName,
    url,
  }: {
    dbName: string;
    url: string;
  }) {
    dbName = newDbName;

    client = await new MongoClient(url, {}).connect();

    return client;
  }

  function getDb() {
    if (!client) {
      throw new Error('Mongo db is undefined');
    }
    return client.db(dbName);
  }
}
