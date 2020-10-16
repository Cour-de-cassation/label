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
    async findById(_id) {
      const result = await collection.findOne({ _id });
      if (!result) {
        throw new Error(`No matching document for _id ${_id}`);
      }
      return result;
    },
    async findOneExceptIds(_ids) {
      const result = await collection.findOne({ _id: { $nin: _ids } });
      if (!result) {
        throw new Error(
          `No document available that was not in the list ${_ids.join(',')}`,
        );
      }
      return result;
    },
  }),
});
