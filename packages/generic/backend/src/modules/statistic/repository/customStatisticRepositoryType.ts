import { idType, ressourceFilterType, statisticType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customStatisticRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customStatisticRepositoryType = {
  findAllStatisticsByDocumentNumber: (
    documentNumber: statisticType['documentNumber'],
  ) => Promise<Array<statisticType>>;
  findAllByRessourceFilter: (
    ressourceFilter: ressourceFilterType,
  ) => Promise<Array<statisticType>>;
  findAllIdsBefore: (date: number) => Promise<Array<idType>>;
  findExtremumTreatmentDateBySources: (
    sources: statisticType['source'][],
  ) => Promise<{ minDate: number | undefined; maxDate: number | undefined }>;
  deleteTreatmentsSummaryByIds: (ids: idType[]) => Promise<number>;
  findRecentStatisticsProjection: <projectionT extends keyof statisticType>(
    projections: Array<projectionT>,
  ) => Promise<Array<projectedType<statisticType, projectionT>>>;
};
