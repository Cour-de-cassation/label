import { ObjectId } from 'mongodb';

export { buildMongoId, areMongoIdEqual };

export type { mongoIdType };

type mongoIdType = ObjectId;

function buildMongoId(id?: string | mongoIdType): mongoIdType {
  return new ObjectId(id);
}

function areMongoIdEqual(id1: mongoIdType, id2: mongoIdType): boolean {
  return id1.equals(id2);
}
