import { assignationStatusType, idType } from '@label/core';

export type { customAssignationRepositoryType };

type customAssignationRepositoryType = {
  updateStatus: (
    userId: idType,
    documentId: idType,
    status: assignationStatusType,
  ) => Promise<void>;
};
