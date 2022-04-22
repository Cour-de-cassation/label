import { timeOperator } from '@label/core';
import { buildProblemReportRepository } from '../../modules/problemReport';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';

export { listDocumentsWithProblemReports };

async function listDocumentsWithProblemReports() {
  logger.log(`listDocumentsWithProblemReports`);

  const problemnReportsRepository = buildProblemReportRepository();
  const documentRepository = buildDocumentRepository();

  const problemReports = await problemnReportsRepository.findAll();
  logger.log(`${problemReports.length} problemReports found`);
  for (let index = 0; index < problemReports.length; index++) {
    const problemReport = problemReports[index];
    const document = await documentRepository.findById(
      problemReport['documentId'],
    );

    logger.log(
      `${index + 1} | ${document['_id']} | ${document['source']} | ${
        document['documentNumber']
      } | ${
        document['creationDate'] &&
        timeOperator.convertTimestampToReadableDate(document['creationDate'])
      }`,
    );
  }

  logger.log('Done');
}
