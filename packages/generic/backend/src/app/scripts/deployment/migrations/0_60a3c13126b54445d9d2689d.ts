import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log(
    'Up: replace document markedAsPublished with toBePublished / published ',
  );

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map(async (document) => {
      if (document.status === 'done') {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          !(document as any).markedAsPublished &&
          documentModule.lib.publicationHandler.mustBePublished(
            document.publicationCategory,
          )
        ) {
          return documentRepository.updateOne(document._id, {
            status: 'toBePublished',
          });
        }
      }
    }),
  );

  await documentRepository.deletePropertiesForMany({}, [
    'markedAsPublished',
  ] as any);
}

async function down() {
  logger.log(
    'Down: replace document markedAsPublished with toBePublished / published ',
  );

  const documentRepository = buildDocumentRepository();

  const documentsToPublish = await documentRepository.findAllByPublicationCategoryLettersProjection(
    documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
    ['_id', 'creationDate', 'documentNumber', 'status'],
  );

  const publishedDocuments = documentsToPublish.filter(
    ({ status }) => status === 'done',
  );
  await documentRepository.updateMany({}, { markedAsPublished: false } as any);
  await documentRepository.updateMany(
    { status: 'toBePublished' },
    { status: 'done' },
  );
  await Promise.all(
    publishedDocuments.map((document) =>
      documentRepository.updateOne(document._id, {
        markedAsPublished: true,
      } as any),
    ),
  );
}
