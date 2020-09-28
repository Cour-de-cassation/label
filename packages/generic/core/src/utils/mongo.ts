import { ObjectId } from "mongodb";

export { buildMongoId, mongoIdType };

type mongoIdType = ObjectId;

function buildMongoId(id?: string | mongoIdType): mongoIdType {
  return new ObjectId(id);
}
