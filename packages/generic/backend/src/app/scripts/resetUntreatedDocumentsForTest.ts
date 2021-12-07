import { documentType } from '@label/core';
import { logger } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';

export { resetUntreatedDocumentsForTest };

async function resetUntreatedDocumentsForTest() {
  logger.log('resetUntreatedDocumentsForTest');
  const documentRepository = buildDocumentRepository();

  const untreatedDocuments = await documentRepository.findAllByStatus(['free']);
  logger.log(`Found ${untreatedDocuments.length} untreated documents`);

  const updatedUntreatedDocuments = untreatedDocuments.map((document) => ({
    ...document,
    route: getRandomRoute(),
  }));

  await Promise.all(
    updatedUntreatedDocuments.map(async (document) => {
      await documentRepository.updateOne(document._id, {
        route: document.route,
        status: document.route === 'automatic' ? 'done' : 'free',
      });
    }),
  );

  logger.log('resetUntreatedDocumentsForTest done!');
}

function getRandomRoute(): documentType['route'] {
  const random = Math.random();

  if (random > 0.7) {
    return 'simple';
  } else if (random > 0.5) {
    return 'default';
  } else if (random > 0.4) {
    return 'confirmation';
  } else if (random > 0.1) {
    return 'exhaustive';
  } else {
    return 'automatic';
  }
}
