import { preAssignationType } from '@label/core';

export type { customPreAssignationRepositoryType };

type customPreAssignationRepositoryType = {
  findOneByNumberAndSource: ({
    number,
    source,
  }: {
    number: string;
    source: string;
  }) => Promise<preAssignationType | undefined>;
};
