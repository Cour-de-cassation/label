import { MongoClient } from 'mongodb';
import { buildMongoId, mongoIdType } from '@label/core';

export { buildMongoId, mongo, mongoIdType };

const uri = 'mongodb://db:27017';

const mongo = buildMongo();

function buildMongo() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  return {
    initialize,
    getDb,
  };

  function initialize() {
    return client.connect();
  }

  function getDb() {
    return client.db('db');
  }
}
