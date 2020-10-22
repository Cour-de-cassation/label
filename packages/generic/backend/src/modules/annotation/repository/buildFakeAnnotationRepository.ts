import { annotationType, idType, idModule } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAnnotationRepositoryType } from './customAnnotationRepositoryType';

export { buildFakeAnnotationRepository };

const buildFakeAnnotationRepository = buildFakeRepositoryBuilder<
  annotationType,
  customAnnotationRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findAllByDocumentId(documentId: idType) {
      return collection.filter((annotation) =>
        idModule.lib.equalId(annotation.documentId, documentId),
      );
    },
    async removeAllByDocumentId(documentId: idType): Promise<void> {
      const newCollection = collection.filter(
        (annotation) =>
          !idModule.lib.equalId(annotation.documentId, documentId),
      );

      while (collection.length) {
        collection.pop();
      }

      for (const annotation of newCollection) {
        collection.push(annotation);
      }
    },
  }),
});
