import { MongoClient, Collection } from 'mongodb';
import { buildMongoId, mongoIdType } from '@label/core';

export { buildMongoId, mongo };

export type { mongoCollectionType, mongoIdType };

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
