import { omit } from 'lodash';
import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) =>
      documentRepository.updateOne(document._id, {
        decisionMetadata: {
          ...omit(document.decisionMetadata, ['juridiction']),
          jurisdiction: (document.decisionMetadata as any).juridiction,
        } as any,
      }),
    ),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) =>
      documentRepository.updateOne(document._id, {
        decisionMetadata: {
          ...omit(document.decisionMetadata, ['jurisdiction']),
          juridiction: document.decisionMetadata.jurisdiction,
        },
      } as any),
    ),
  );
}
