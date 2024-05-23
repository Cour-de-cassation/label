import { preAssignationType } from '@label/core';

export type { customPreAssignationRepositoryType };

type customPreAssignationRepositoryType = {
  findOneByDocumentNumberAndSource: ({
    documentNumber,
    source,
  }: {
    documentNumber: number;
    source: string;
  }) => Promise<preAssignationType | undefined>;
};
