import { ObjectId } from "mongodb";

export { buildMongoId };

export type { mongoIdType };

type mongoIdType = ObjectId;

function buildMongoId(id?: string | mongoIdType): mongoIdType {
  return new ObjectId(id);
}
