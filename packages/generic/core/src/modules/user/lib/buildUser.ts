import { buildMongoId } from "../../../utils";
import { userType } from "../userType";

export { buildUser };

function buildUser({
  email,
  password,
}: {
  email: userType["email"];
  password: userType["password"];
}): userType {
  return {
    email,
    _id: buildMongoId(),
    password,
  };
}
