import { documentType, mongoIdType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  findById: (id: mongoIdType) => Promise<documentType>;
  findOneExceptIds: (idsToExclude: mongoIdType[]) => Promise<documentType>;
};
