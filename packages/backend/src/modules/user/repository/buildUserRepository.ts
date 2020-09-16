import { mongo } from '../../../lib/mongo';

export { buildUserRepository };

function buildUserRepository() {
  const db = mongo.getDb();
  const collection = db.collection('users');

  return {
    insert,
  }

  async function insert(user: { email: string, password: string }) {
    const insertResult = await collection.insertOne(user);
    return { success: !!insertResult.result.ok }
  }

}
