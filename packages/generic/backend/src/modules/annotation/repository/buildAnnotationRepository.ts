import { annotationType, mongoIdType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAnnotationRepositoryType } from './customAnnotationRepositoryType';

export { buildAnnotationRepository };

const buildAnnotationRepository = buildRepositoryBuilder<
  annotationType,
  customAnnotationRepositoryType
>({
  collectionName: 'annotations',
  buildCustomRepository: (collection) => ({
    async findByDocumentId(documentId: mongoIdType) {
      return collection.find({ documentId }).toArray();
    },
  }),
});
