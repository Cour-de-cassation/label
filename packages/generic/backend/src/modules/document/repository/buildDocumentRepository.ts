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
    async assign() {
      const document = await collection.findOne({
        status: 'free',
      });

      if (!document) {
        throw new Error(`No free document`);
      }

      const { modifiedCount } = await collection.updateOne(document, {
        $set: { status: 'pending' },
      });

      if (modifiedCount !== 1) {
        return this.assign();
      }

      return document;
    },

    async findAllByIds(ids) {
      return collection.find({ _id: { $in: ids } }).toArray();
    },

    async updateStatus(id, status) {
      await collection.update({ _id: id }, { $set: { status } });
    },
  }),
});
