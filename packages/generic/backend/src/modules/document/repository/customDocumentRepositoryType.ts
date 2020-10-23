import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  findOneExceptIds: (idsToExclude: idType[]) => Promise<documentType>;
};
