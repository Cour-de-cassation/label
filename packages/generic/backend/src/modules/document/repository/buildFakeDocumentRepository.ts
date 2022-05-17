import { uniq } from 'lodash';
import { documentType, idModule } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  projectFakeObjects,
  updateFakeCollection,
} from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildFakeDocumentRepository };

const buildFakeDocumentRepository = buildFakeRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  collectionName: 'documents',
  buildCustomFakeRepository: (collection) => ({
    async countNotIn(idsNotToSearchIn) {
      return collection.filter(
        (document) =>
          !idsNotToSearchIn.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      ).length;
    },

    async findNotIn(idsNotToSearchIn) {
      return collection.filter(
        (document) =>
          !idsNotToSearchIn.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      );
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

    async findAllByNACCodesAndStatus(
      NACCodes: documentType['decisionMetadata']['NACCode'][],
      statuses: documentType['status'][],
    ) {
      return collection.filter(
        (document) =>
          NACCodes.some((NACCode) =>
            document.publicationCategory.includes(NACCode),
          ) && statuses.includes(document.status),
      );
    },

    async findAllByPublicationCategoryLettersAndStatus(
      publicationCategoryLetters,
      statuses,
    ) {
      return collection.filter(
        (document) =>
          publicationCategoryLetters.some((publicationCategoryLetter) =>
            document.publicationCategory.includes(publicationCategoryLetter),
          ) && statuses.includes(document.status),
      );
    },

    async findAllByPublicationCategoryLettersProjection(
      publicationCategoryLetters,
      projections,
    ) {
      return collection
        .filter((document) =>
          publicationCategoryLetters.some((publicationCategoryLetter) =>
            document.publicationCategory.includes(publicationCategoryLetter),
          ),
        )
        .map((document) => projectFakeObjects(document, projections));
    },

    async findAllByStatus(status) {
      return collection.filter((document) => status.includes(document.status));
    },

    async findAllByStatusProjection(status, projections) {
      return collection
        .filter((document) => status.includes(document.status))
        .map((document) => projectFakeObjects(document, projections));
    },

    async findOneByStatusAndPriorityNotIn(
      { status, priority },
      idsNotToSearchIn,
    ) {
      const document = await collection.find(
        (document) =>
          document.status === status &&
          document.priority === priority &&
          !idsNotToSearchIn.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      );
      return document || undefined;
    },

    async findOneByDocumentNumberAndSource({ documentNumber, source }) {
      return collection.find(
        (document) =>
          document.source === source &&
          document.documentNumber === documentNumber,
      );
    },

    async findOneByStatusAndPriorityAmong(
      { status, priority },
      idsToSearchInFirst,
    ) {
      const freeDocuments = collection
        .filter(
          (document) =>
            document.priority === priority &&
            document.status === status &&
            idsToSearchInFirst.some((id) =>
              idModule.lib.equalId(document._id, id),
            ),
        )
        .sort(
          (documentA, documentB) =>
            documentB.decisionMetadata.date ||
            0 - (documentA.decisionMetadata.date || 0),
        );
      return freeDocuments[0];
    },

    async findByStatusAndPriorityLimitAmong(
      { status, priority },
      limit,
      idsToSearchInFirst,
    ) {
      const documents = collection
        .filter(
          (document) =>
            document.priority === priority &&
            document.status === status &&
            idsToSearchInFirst.some((id) =>
              idModule.lib.equalId(document._id, id),
            ),
        )
        .sort(
          (documentA, documentB) =>
            (documentB.decisionMetadata.date || 0) -
            (documentA.decisionMetadata.date || 0),
        )
        .slice(0, limit);
      return documents;
    },

    async updateStatusById(_id, status) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                status,
                updateDate: new Date().getTime(),
              }
            : document,
        ),
      );
      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },
    async updateOneStatusByIdAndStatus(filter, update) {
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

      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(filter._id, document._id),
      );

      return updatedDocument;
    },
  }),
});
