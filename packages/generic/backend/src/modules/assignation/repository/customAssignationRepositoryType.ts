import { assignationType, idType } from '@label/core';

export type { customAssignationRepositoryType };

type customAssignationRepositoryType = {
  findAllByUserId: (userId: idType) => Promise<assignationType[]>;
  updateStatus: (
    userId: idType,
    documentId: idType,
    status: assignationType['status'],
  ) => Promise<void>;
};
