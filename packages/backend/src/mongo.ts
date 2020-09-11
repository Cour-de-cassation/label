import { MongoClient, Db } from 'mongodb';

export { mongo, MongoDbType };

type MongoDbType = Db;

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
