import { documentType, idModule } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildFakeDocumentRepository };

const buildFakeDocumentRepository = buildFakeRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async lock({ idsToExclude } = {}) {
      const result = idsToExclude
        ? collection.find((document) => !idsToExclude.includes(document._id))
        : collection[0];

      if (!result) {
        throw new Error(
          `No document available that was not in the list ${(
            idsToExclude || []
          ).join(',')}`,
        );
      }

      collection = collection.map((document) =>
        idModule.lib.equalId(document._id, result._id)
          ? { ...document, locked: true }
          : document,
      );

      return result;
    },
  }),
});
