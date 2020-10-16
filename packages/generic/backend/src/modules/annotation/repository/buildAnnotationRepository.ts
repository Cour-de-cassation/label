import { annotationType, idType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAnnotationRepositoryType } from './customAnnotationRepositoryType';

export { buildAnnotationRepository };

const buildAnnotationRepository = buildRepositoryBuilder<
  annotationType,
  customAnnotationRepositoryType
>({
  collectionName: 'annotations',
  buildCustomRepository: (collection) => ({
    async findAllByDocumentId(documentId: idType) {
      return collection.find({ documentId }).toArray();
    },
  }),
});
