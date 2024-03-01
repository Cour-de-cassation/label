import { buildStatisticRepository } from '../repository';
import { logger } from '../../../utils';

export { fetchDocumentStatistics };

async function fetchDocumentStatistics(documentNumber: number) {
  const documentStatisticsRepository = buildStatisticRepository();
  const documentStatistics = documentStatisticsRepository.findAllStatisticsByDocumentNumber(documentNumber)
  logger.log({ operationName: "fetchDocumentStatistics", msg: `the documentStatistics : ${documentStatistics}` })
  return documentStatistics;
}
