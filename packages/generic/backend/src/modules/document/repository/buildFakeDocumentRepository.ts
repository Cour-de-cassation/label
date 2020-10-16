import { documentType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildFakeDocumentRepository };

const buildFakeDocumentRepository = buildFakeRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findById(_id) {
      const result = collection.find((document) => document._id === _id);
      if (!result) {
        throw new Error(`No matching document for _id ${_id}`);
      }
      return result;
    },
    async findOneExceptIds(_ids) {
      const result = collection.find(
        (document) => !_ids.includes(document._id),
      );
      if (!result) {
        throw new Error(
          `No document available that was not in the list ${_ids.join(',')}`,
        );
      }
      return result;
    },
  }),
});
