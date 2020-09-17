import { mongoIdType } from "../../utils";

export { userType };

type userType = {
  _id: mongoIdType;
  email: string;
  password: string;
};
