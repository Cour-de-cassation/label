import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  assign: () => Promise<documentType>;
  findAllByStatus: (status: documentType['status']) => Promise<documentType[]>;
  updateStatusById: (
    id: idType,
    status: documentType['status'],
  ) => Promise<void>;
};
