import { logger } from '../../utils';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { documentType, settingsType } from '@label/core';
import { statisticService } from '../../modules/statistic';

export { deleteDocument };

async function deleteDocument(
  documentNumber: documentType['documentNumber'],
  source: documentType['source'],
  settings: settingsType,
) {
  logger.log({ operationName: 'deleteDocument', msg: 'START' });
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });

  if (document) {
    if (document.status != 'loaded' && document.status != 'nlpAnnotating') {
      await statisticService.saveStatisticsOfDocument(
        document,
        settings,
        'deleted with script',
      );
    }
    await documentService.deleteDocument(document._id);
  } else {
    logger.log({
      operationName: 'deleteDocument',
      msg: `Document ${source}:${documentNumber} not found`,
    });
  }
  logger.log({ operationName: 'deleteDocument', msg: 'DONE' });
}
