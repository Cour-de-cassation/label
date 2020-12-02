import { documentType, idModule } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildFakeDocumentRepository };

const buildFakeDocumentRepository = buildFakeRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async assign() {
      const result = collection[0];

      if (!result) {
        throw new Error(`No free document`);
      }

      collection = collection.map((document) =>
        idModule.lib.equalId(document._id, result._id)
          ? { ...document, status: 'free' }
          : document,
      );

      return result;
    },

    async findAllByIds(ids) {
      return collection.filter((document) =>
        ids.some((id) => idModule.lib.equalId(id, document._id)),
      );
    },

    async updateStatus(id, status) {
      collection = collection.map((document) =>
        idModule.lib.equalId(id, document._id)
          ? {
              ...document,
              status,
            }
          : document,
      );
    },
  }),
});
