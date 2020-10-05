import { annotationType, mongoIdType, areMongoIdEqual } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAnnotationRepositoryType } from './customAnnotationRepositoryType';

export { buildFakeAnnotationRepository };

const buildFakeAnnotationRepository = buildFakeRepositoryBuilder<
  annotationType,
  customAnnotationRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findByDocumentId(documentId: mongoIdType) {
      return collection.filter((annotation) =>
        areMongoIdEqual(annotation.documentId, documentId),
      );
    },
  }),
});
