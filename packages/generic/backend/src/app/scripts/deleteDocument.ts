import { logger } from '../../utils';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { documentType } from '@label/core';
import { statisticService } from '../../modules/statistic';
import { settingsLoader } from '../../lib/settingsLoader';

export { deleteDocument };

async function deleteDocument(
  documentNumber: documentType['documentNumber'],
  source: documentType['source'],
) {
  logger.log({ operationName: 'deleteDocument', msg: 'START' });
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findOneByDocumentNumberAndSource({
    documentNumber,
    source,
  });

  if (document) {
    const settings = settingsLoader.getSettings();
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
