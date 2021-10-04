import { buildDocumentRepository } from '../../../../modules/document';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) => {
      const priority = computeNewPriority(
        (document.priority as unknown) as 'low' | 'medium' | 'high',
      );

      documentRepository.updateOne(document._id, { priority });
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAll();

  await Promise.all(
    documents.map((document) => {
      const priority = computeOldPriority(document.priority);

      documentRepository.updateOne(document._id, { priority } as any);
    }),
  );
}

function computeOldPriority(priority: number): 'low' | 'medium' | 'high' {
  if (priority === 4) {
    return 'high';
  } else if (priority === 2) {
    return 'medium';
  } else {
    return 'low';
  }
}

function computeNewPriority(priority: 'low' | 'medium' | 'high') {
  switch (priority) {
    case 'high':
      return 4;
    case 'medium':
      return 2;
    case 'low':
      return 0;
  }
}
