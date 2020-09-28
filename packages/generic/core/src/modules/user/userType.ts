import { mongoIdType } from "../../utils";

export type { userType };

type userType = {
  _id: mongoIdType;
  email: string;
  password: string;
};
