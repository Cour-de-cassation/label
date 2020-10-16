import { mongoIdType } from "../../lib";

export type { assignationType };

type assignationType = {
  userId: mongoIdType;
  documentId: mongoIdType;
};
