import { MongoClient, Collection } from 'mongodb';
import { environment } from '@label/core';

export { buildMongo, mongo };

export type { mongoCollectionType };

type mongoCollectionType<T> = Collection<T>;

const mongo = buildMongo({
  dbName: environment.dbName,
  url: `mongodb://${environment.dbName}:${environment.port.db}`,
});

function buildMongo({ dbName, url }: { dbName: string; url: string }) {
  let client = new MongoClient(url, {
    useUnifiedTopology: true,
  });

  return {
    close,
    initialize,
    getDb,
  };

  async function close() {
    await client.close();
  }

  async function initialize() {
    client = await client.connect();
    return client;
  }

  function getDb() {
    return client.db(dbName);
  }
}
