import { MongoClient, Collection } from 'mongodb';
import { buildMongoId, mongoIdType } from '@label/core';

export { buildMongoId, mongo };

export type { mongoCollectionType, mongoIdType }

type mongoCollectionType<T> = Collection<T>;

const mongo = {
  initialize,
  getDb,
};

const client = new MongoClient('mongodb://db:27017', {
  useUnifiedTopology: true,
});

function initialize() {
  return client.connect();
}

function getDb() {
  return client.db('db');
}
