import { MongoClient, Collection, WithId } from 'mongodb';

export { buildMongo, mongo };

export type { mongoCollectionType };

type mongoCollectionType<T> = Collection<WithId<T>>;

const mongo = buildMongo();

function buildMongo() {
  let client = new MongoClient('');
  let dbName = '';

  return {
    close,
    initialize,
    getDb,
  };

  async function close() {
    await client.close();
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
    return client.db(dbName);
  }
}
