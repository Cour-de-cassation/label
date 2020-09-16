import { mongo } from '../../../lib/mongo';

export { buildUserRepository };

function buildUserRepository() {
  const db = mongo.getDb();
  const collection = db.collection('users');

  return {
    insert,
    findOne,
  };

  async function insert(user: { email: string; password: string }) {
    const insertResult = await collection.insertOne(user);
    return { success: !!insertResult.result.ok };
  }

  async function findOne(user: { email: string }) {
    const result = await collection.findOne({ email: user.email });
    if (!result) {
      throw new Error(`No matching user for email ${user.email}`);
    }
    return result;
  }
}
