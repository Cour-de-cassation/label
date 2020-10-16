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
  }),
});
