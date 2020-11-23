import { MongoClient, Collection } from 'mongodb';

export { mongo };

export type { mongoCollectionType };

type mongoCollectionType<T> = Collection<T>;

const mongo = buildMongo();

function buildMongo() {
  let client = new MongoClient('mongodb://db:27017', {
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
    return client.db('db');
  }
}
