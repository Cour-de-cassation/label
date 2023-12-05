import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { buildUserRepository } from '../../../../modules/user';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const userRepository = buildUserRepository();
  const users = await userRepository.findAllProjection(['name', 'role']);
  const adminUser = users.find((user) => user.role === 'admin');
  if (!adminUser) {
    throw new Error('No user found with admin role');
  }

  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllProjection([
    '_id',
    'reviewStatus',
  ]);

  await Promise.all(
    documents.map(async (document) => {
      let newReviewStatus: documentType['reviewStatus'];
      if ((document.reviewStatus as any) === 'none') {
        newReviewStatus = { hasBeenAmended: false, viewerNames: [] };
      } else if ((document.reviewStatus as any) === 'read') {
        newReviewStatus = {
          hasBeenAmended: false,
          viewerNames: [adminUser.name],
        };
      } else if ((document.reviewStatus as any) === 'amended') {
        newReviewStatus = {
          hasBeenAmended: true,
          viewerNames: [adminUser.name],
        };
      } else {
        newReviewStatus = { hasBeenAmended: false, viewerNames: [] };
      }
      return documentRepository.updateOne(document._id, {
        reviewStatus: newReviewStatus,
      });
    }),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const documentRepository = buildDocumentRepository();
  const documents = await documentRepository.findAllProjection([
    '_id',
    'reviewStatus',
  ]);

  await Promise.all(
    documents.map(async (document) => {
      let reviewStatus = 'none';
      if (document.reviewStatus.hasBeenAmended) {
        reviewStatus = 'amended';
      } else if (document.reviewStatus.viewerNames.length > 0) {
        reviewStatus = 'read';
      }
      return documentRepository.updateOne(document._id, {
        reviewStatus: reviewStatus as any,
      });
    }),
  );
}
