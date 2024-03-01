import { idType, ressourceFilterType, statisticType } from '@label/core';

export type { customStatisticRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customStatisticRepositoryType = {
  findAllStatisticsByDocumentNumber: (documentNumber: number) => Promise<Array<statisticType>>;
  findAllByRessourceFilter: (
    ressourceFilter: ressourceFilterType,
  ) => Promise<Array<statisticType>>;
  findAllIdsBefore: (date: number) => Promise<Array<idType>>;
  findExtremumTreatmentDateBySources: (
    sources: statisticType['source'][],
  ) => Promise<{ minDate: number | undefined; maxDate: number | undefined }>;
};
