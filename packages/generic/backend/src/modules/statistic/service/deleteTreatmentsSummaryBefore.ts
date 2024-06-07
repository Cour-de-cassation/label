import { dateBuilder } from '@label/core';
import { logger } from '../../../utils';
import { buildStatisticRepository } from '../repository';

export { deleteTreatmentsSummaryBefore };

async function deleteTreatmentsSummaryBefore({
  since,
  unit,
}: {
  since: number;
  unit: 'MONTHS';
}) {
  const statisticRepository = buildStatisticRepository();

  const statisticsExpirationDate = computeExpirationDate();
  const treatmentsSummaryToDeleteIds = await statisticRepository.findAllIdsBefore(
    statisticsExpirationDate,
  );

  const count = await statisticRepository.deleteTreatmentsSummaryByIds(
    treatmentsSummaryToDeleteIds,
  );

  logger.log({
    operationName: 'deleteStaticticsBefore',
    msg: `START: ${since}${unit}: ${count} statistics deleted`,
  });

  function computeExpirationDate() {
    switch (unit) {
      case 'MONTHS':
        return dateBuilder.monthsAgo(since);
    }
  }
}
