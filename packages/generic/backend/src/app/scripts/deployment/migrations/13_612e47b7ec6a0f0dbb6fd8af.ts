import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) => {
      const appealNumber = extractAppealNumber(document.text);

      return documentRepository.updateOne(document._id, {
        decisionMetadata: {
          ...document.decisionMetadata,
          appealNumber: appealNumber || '',
        },
      });
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const documentRepository = buildDocumentRepository();

  await documentRepository.deletePropertiesForMany({}, [
    'decisionMetadata.appealNumber',
  ]);
}

function extractAppealNumber(text: string) {
  const REGEX_1 = /\D\s(\d{2}-\d{2}\.\d{3})/;

  const REGEX_2 = /\d{2}-\d{5}/;
  const match1 = text.match(REGEX_1);
  if (!!match1 && match1[1]) {
    return match1[1];
  }
  const match2 = text.match(REGEX_2);
  if (!!match2 && match2[0]) {
    return match2[0];
  }
  return undefined;
}
