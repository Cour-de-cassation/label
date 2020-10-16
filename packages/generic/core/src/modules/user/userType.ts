import { idType } from "../id";

export type { userType };

type userType = {
  _id: idType;
  email: string;
  password: string;
};
