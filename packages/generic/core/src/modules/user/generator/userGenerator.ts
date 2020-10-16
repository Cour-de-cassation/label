import { buildMongoId } from "../../../lib";
import { generatorType } from "../../../types";
import { userType } from "../userType";

export { userGenerator };

const userGenerator: generatorType<userType> = {
  generate: ({ email, _id, password } = {}) => ({
    email: email ? email : "EMAIL",
    _id: _id ? buildMongoId(_id) : buildMongoId(),
    password: password ? password : "PASSWORD",
  }),
};
