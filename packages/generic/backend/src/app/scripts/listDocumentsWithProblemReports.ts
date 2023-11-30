import { timeOperator } from '@label/core';
import { buildProblemReportRepository } from '../../modules/problemReport';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';

export { listDocumentsWithProblemReports };

async function listDocumentsWithProblemReports() {
  logger.log({
    operationName: 'listDocumentsWithProblemReports',
    msg: 'START',
  });

  const problemnReportsRepository = buildProblemReportRepository();
  const documentRepository = buildDocumentRepository();

  const problemReports = await problemnReportsRepository.findAll();
  logger.log({
    operationName: 'listDocumentsWithProblemReports',
    msg: `${problemReports.length} problemReports found`,
  });
  for (let index = 0; index < problemReports.length; index++) {
    const problemReport = problemReports[index];
    const document = await documentRepository.findById(
      problemReport['documentId'],
    );

    logger.log({
      operationName: 'listDocumentsWithProblemReports',
      msg: `${index + 1} | ${document['_id']} | ${document['source']} | ${
        document['documentNumber']
      } | ${
        document['creationDate'] &&
        timeOperator.convertTimestampToReadableDate(document['creationDate'])
      }`,
    });
  }

  logger.log({ operationName: 'listDocumentsWithProblemReports', msg: 'DONE' });
}
