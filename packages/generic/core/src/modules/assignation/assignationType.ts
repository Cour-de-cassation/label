import { idType } from "../id";

export type { assignationType, assignationStatusType };

type assignationType = {
  _id: idType;
  userId: idType;
  documentId: idType;
  status: assignationStatusType;
};

type assignationStatusType = "rejected" | "pending" | "saved" | "done";
