import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) =>
      documentRepository.updateOne(document._id, {
        reviewStatus: 'none',
      } as any),
    ),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const documentRepository = buildDocumentRepository();

  await documentRepository.deletePropertiesForMany({}, ['reviewStatus']);
}
