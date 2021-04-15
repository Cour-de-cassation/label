import { ressourceFilterType, statisticType } from '@label/core';

export type { customStatisticRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customStatisticRepositoryType = {
  findAllByRessourceFilter: (
    ressourceFilter: ressourceFilterType,
  ) => Promise<Array<statisticType>>;
};
