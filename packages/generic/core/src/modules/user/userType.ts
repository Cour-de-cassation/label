import { mongoIdType } from "../../lib";

export type { userType };

type userType = {
  _id: mongoIdType;
  email: string;
  password: string;
};
