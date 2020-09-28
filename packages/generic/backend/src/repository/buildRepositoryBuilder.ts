import { mongo, mongoCollectionType } from '../lib/mongo';
import { repositoryType } from './repositoryType';

export { buildRepositoryBuilder };

function buildRepositoryBuilder<T, U>({
  collectionName,
  buildCustomRepository,
}: {
  collectionName: string;
  buildCustomRepository: (collection: mongoCollectionType<T>) => U;
}): () => repositoryType<T> & U {
  return () => {
    const db = mongo.getDb();
    const collection = db.collection<T>(collectionName);
    const customRepository = buildCustomRepository(collection);

    return {
      findAll,
      insert,
      ...customRepository,
    };

    async function findAll() {
      return collection.find().toArray();
    }

    async function insert(newObject: T) {
      const insertResult = await collection.insertOne(newObject as any);
      return { success: !!insertResult.result.ok };
    }
  };
}
