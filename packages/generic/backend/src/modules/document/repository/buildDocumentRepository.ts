import { documentType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildDocumentRepository };

const buildDocumentRepository = buildRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  collectionName: 'documents',
  buildCustomRepository: (collection) => ({
    async lock({ idsToExclude } = {}) {
      const document = idsToExclude
        ? await collection.findOne({
            _id: { $nin: idsToExclude },
            locked: false,
          })
        : await collection.findOne({
            locked: false,
          });

      if (!document) {
        throw new Error(
          `No document unlocked (ids to exclude ${(idsToExclude || []).join(
            ',',
          )}`,
        );
      }

      const { modifiedCount } = await collection.updateOne(document, {
        $set: { locked: true },
      });

      if (modifiedCount !== 1) {
        return this.lock({ idsToExclude });
      }

      return document;
    },
  }),
});
