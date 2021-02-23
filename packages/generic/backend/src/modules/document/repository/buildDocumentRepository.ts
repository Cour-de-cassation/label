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
    async assign(priority) {
      const document = await collection.findOne({
        priority,
        status: 'free',
      });

      if (!document) {
        throw new Error(`No free document of ${priority} priority`);
      }

      const { modifiedCount } = await collection.updateOne(document, {
        $set: { status: 'pending' },
      });

      if (modifiedCount !== 1) {
        return this.assign(priority);
      }

      return document;
    },

    async findAllByStatus(status) {
      return collection.find({ status }).toArray();
    },

    async updateStatusById(id, status) {
      await collection.updateOne(
        { _id: id },
        { $set: { status, updateDate: new Date().getTime() } },
      );
    },
  }),
});
