import { mongoIdType } from "../../utils";

export type { assignationType };

type assignationType = {
  userId: mongoIdType;
  documentId: mongoIdType;
};
