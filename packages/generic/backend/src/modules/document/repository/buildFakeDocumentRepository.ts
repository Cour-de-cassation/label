import { isEqual, uniq } from 'lodash';
import { documentType, idModule } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  projectedType,
  projectFakeObjects,
  updateFakeCollection,
} from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildFakeDocumentRepository };

const buildFakeDocumentRepository = buildFakeRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async countNotIn(idsNotToSearchIn) {
      return collection.filter(
        (document) =>
          !idsNotToSearchIn.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      ).length;
    },

    async findAllPublicationCategories() {
      let publicationCategories: string[] = [];
      collection.forEach(
        (document) =>
          (publicationCategories = uniq(
            publicationCategories.concat(document.publicationCategory),
          )),
      );

      return publicationCategories;
    },

    async findAllSources() {
      return uniq(collection.map((document) => document.source));
    },

    async findAllByPublicationCategory({ publicationCategory }) {
      return collection.filter((document) =>
        isEqual(document.publicationCategory, publicationCategory),
      );
    },

    async findAllByStatus(status) {
      return collection.filter((document) => status.includes(document.status));
    },

    async findAllByStatusProjection<projectionT extends keyof documentType>(
      status: documentType['status'][],
      projections: Array<projectionT>,
    ): Promise<Array<projectedType<documentType, projectionT>>> {
      return collection
        .filter((document) => status.includes(document.status))
        .map((document) => projectFakeObjects(document, projections));
    },

    async findOneByPriorityNotIn({ priority }, idsNotToSearchIn) {
      const document = await collection.find(
        (document) =>
          document.priority === priority &&
          !idsNotToSearchIn.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      );
      return document || undefined;
    },

    async findOneByStatusAndPriorityAmong(
      { status, priority },
      idsToSearchInFirst,
    ) {
      const freeDocument = collection.find(
        (document) =>
          document.priority === priority &&
          document.status === status &&
          idsToSearchInFirst.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      );
      return freeDocument;
    },

    async updateStatusById(id, status) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(id, document._id)
            ? {
                ...document,
                status,
                updateDate: new Date().getTime(),
              }
            : document,
        ),
      );
    },
    async updateOneStatusByIdAndStatus(filter, update) {
      const documentsToModifyCount = collection.filter(
        (document) =>
          idModule.lib.equalId(filter._id, document._id) &&
          document.status === filter.status,
      ).length;
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(filter._id, document._id) &&
          document.status === filter.status
            ? {
                ...document,
                status: update.status,
                updateDate: new Date().getTime(),
              }
            : document,
        ),
      );
      return documentsToModifyCount === 1;
    },
  }),
});
