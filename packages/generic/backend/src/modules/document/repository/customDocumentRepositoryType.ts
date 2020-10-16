import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  findById: (id: idType) => Promise<documentType>;
  findOneExceptIds: (idsToExclude: idType[]) => Promise<documentType>;
};
