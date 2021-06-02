import { omit } from 'lodash';
import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) =>
      documentRepository.updateOne(document._id, {
        decisionMetadata: {
          ...document.decisionMetadata,
          categoriesToOmit: [],
          additionalTermsToAnnotate: '',
        },
      }),
    ),
  );
}

async function down() {
  logger.log('Down: ');

  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) =>
      documentRepository.updateOne(document._id, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        decisionMetadata: omit(document.decisionMetadata, [
          'categoriesToOmit',
          'additionalTermsToAnnotate',
        ]) as any,
      }),
    ),
  );
}
