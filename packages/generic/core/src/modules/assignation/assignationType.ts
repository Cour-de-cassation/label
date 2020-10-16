import { mongoIdType } from "../../lib";

export type { assignationType };

type assignationType = {
  _id: mongoIdType;
  userId: mongoIdType;
  documentId: mongoIdType;
};
