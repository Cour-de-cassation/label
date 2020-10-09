import { omitMongoIdType } from "../../../types";
import { buildMongoId } from "../../../utils";
import { userType } from "../userType";

export { buildUser };

function buildUser(userFields: omitMongoIdType<userType>): userType {
  return {
    ...userFields,
    _id: buildMongoId(),
  };
}
