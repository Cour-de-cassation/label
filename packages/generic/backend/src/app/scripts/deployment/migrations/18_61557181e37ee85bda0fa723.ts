import { uniq } from 'lodash';
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
          categoriesToOmit: uniq([
            ...document.decisionMetadata.categoriesToOmit,
            'personneMorale',
            'professionnelMagistratGreffier',
            'numeroSiretSiren',
            'etablissement',
          ]),
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
        decisionMetadata: {
          ...document.decisionMetadata,
          categoriesToOmit: document.decisionMetadata.categoriesToOmit.filter(
            (category) =>
              category !== 'personneMorale' &&
              category !== 'professionnelMagistratGreffier' &&
              category !== 'numeroSiretSiren' &&
              category !== 'etablissement',
          ),
        },
      }),
    ),
  );
}
