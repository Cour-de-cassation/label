import { range } from 'lodash';
import { documentModule, statisticModule } from '@label/core';
import { assignationService } from '../../modules/assignation';
import { documentService } from '../../modules/document';
import { buildStatisticRepository } from '../../modules/statistic';
import { buildUserRepository } from '../../modules/user';
import { logger } from '../../utils';

export { insertTestStatistics };

const ONE_DAY = 24 * 60 * 60 * 1000;

async function insertTestStatistics() {
  const userRepository = buildUserRepository();
  const users = await userRepository.findAll();
  const user = users[0];

  const statisticRepository = buildStatisticRepository();
  const currentDate = new Date().getTime();
  const statistics = range(30000).map((index) =>
    statisticModule.generator.generate({
      source: index % 2 ? 'jurinet' : 'jurica',
      treatmentDate: currentDate - index * ONE_DAY,
      publicationCategory:
        index % 2
          ? documentModule.lib.publicationHandler.getPublishedPublicationCategory()
          : [],
    }),
  );
  logger.log(`Inserting statistics...`);
  await statisticRepository.insertMany(statistics);
  logger.log(`Statistics inserted!`);

  logger.log(`Inserting assignations...`);
  const freeDocumentIds = await documentService.fetchFreeDocumentsIds();
  for (let i = 0, l = freeDocumentIds.length / 2; i < l; i++) {
    logger.log(`Assignation ${i + 1}/${l}`);
    const documentId = freeDocumentIds[i];
    await assignationService.createAssignation({
      userId: user._id,
      documentId,
    });
    await documentService.updateDocumentStatus(documentId, 'done');
  }
  logger.log(`Assignations inserted!`);
}
