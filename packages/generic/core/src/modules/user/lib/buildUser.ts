import { buildMongoId } from "../../../lib";
import { omitMongoIdType } from "../../../types";
import { userType } from "../userType";

export { buildUser };

function buildUser(userFields: omitMongoIdType<userType>): userType {
  return {
    ...userFields,
    _id: buildMongoId(),
  };
}
