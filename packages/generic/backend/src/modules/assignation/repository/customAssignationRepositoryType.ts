import { assignationStatusType, assignationType, idType } from '@label/core';

export type { customAssignationRepositoryType };

type customAssignationRepositoryType = {
  findByUserId: (userId: idType) => Promise<assignationType[]>;
  updateStatus: (
    userId: idType,
    documentId: idType,
    status: assignationStatusType,
  ) => Promise<void>;
};
