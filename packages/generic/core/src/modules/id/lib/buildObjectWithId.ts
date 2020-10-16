import { idType } from "../idType";
import { buildId } from "./buildId";

export { buildObjectWithId };

function buildObjectWithId<T>(object: T): T & { _id: idType } {
  return {
    ...object,
    _id: buildId(),
  };
}
