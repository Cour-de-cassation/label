import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  assign: () => Promise<documentType>;
  findAllByIds: (ids: idType[]) => Promise<documentType[]>;
  updateStatus: (id: idType, status: documentType['status']) => Promise<void>;
};
