import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down, extractDateFromTitle };

async function up() {
  logger.log('Up: ');

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) => {
      const decisionDate = extractDateFromTitle(document.title);

      return documentRepository.updateOne(document._id, {
        decisionMetadata: {
          ...document.decisionMetadata,
          date: decisionDate?.getTime(),
        },
      });
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const documentRepository = buildDocumentRepository();

  await documentRepository.deletePropertiesForMany({}, [
    'decisionMetadata.date',
  ]);
}

function extractDateFromTitle(title: string) {
  const splitTitle = title.split(' · ');
  if (splitTitle.length === 0) {
    return undefined;
  }
  const rawDate = splitTitle[splitTitle.length - 1];
  if (!rawDate) {
    return undefined;
  }
  const splitDate = rawDate.split('/').map((value) => parseInt(value));
  if (splitDate.length !== 3 || splitDate.some((value) => isNaN(value))) {
    return undefined;
  }
  const formattedDate = new Date();
  formattedDate.setDate(splitDate[0]);
  formattedDate.setMonth(splitDate[1] - 1);
  formattedDate.setFullYear(splitDate[2]);
  return formattedDate;
}
