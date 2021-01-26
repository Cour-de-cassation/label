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
      const freeDocument = collection.find(
        (document) => document.status === 'free',
      );

      if (!freeDocument) {
        throw new Error(`No free document`);
      }

      collection = collection.map((document) =>
        idModule.lib.equalId(document._id, freeDocument._id)
          ? { ...document, status: 'pending' }
          : document,
      );

      return freeDocument;
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
