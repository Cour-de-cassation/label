import {
  buildDocumentRepository,
  documentService,
} from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map(async (document) => {
      if (document.decisionMetadata.categoriesToOmit.includes('adresse')) {
        await documentService.updateDocumentStatus(document._id, 'loaded');
        return documentRepository.updateOne(document._id, {
          decisionMetadata: {
            ...document.decisionMetadata,
            categoriesToOmit: [
              'personneMorale',
              'numeroSiretSiren',
              'professionnelMagistratGreffier',
            ],
          },
        });
      }
    }),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });
}
