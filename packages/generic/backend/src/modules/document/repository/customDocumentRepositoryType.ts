import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  assign: () => Promise<documentType>;
  updateStatus: (id: idType, status: documentType['status']) => Promise<void>;
};
