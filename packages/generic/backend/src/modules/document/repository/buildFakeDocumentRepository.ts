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
    async countByStatus(status) {
      return collection.filter((document) => status.includes(document.status))
        .length;
    },

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

    async findAllByRoutesOrPublicationCategoryLettersProjection(
      routes,
      publicationCategoryLetters,
      projections,
    ) {
      return collection
        .filter(
          (document) =>
            publicationCategoryLetters.some((publicationCategoryLetter) =>
              document.publicationCategory.includes(publicationCategoryLetter),
            ) || routes.includes(document.route),
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

    async findOneByStatusWithoutLossNotIn(statuses, idsNotToSearchIn) {
      const document = await collection.find(
        (document) =>
          statuses.some(
            (status: documentType['status']) => document.status === status,
          ) &&
          document.loss === undefined &&
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

    async findOneByExternalId(externalId) {
      const document = collection.find(
        (document) => document.externalId === externalId,
      );
      return document || undefined;
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

    async findOneRandomByStatusAndPriorityAmong(
      { status, priority },
      idsToSearchInFirst,
    ) {
      const freeDocuments = collection.filter(
        (document) =>
          document.priority === priority &&
          document.status === status &&
          idsToSearchInFirst.some((id) =>
            idModule.lib.equalId(document._id, id),
          ),
      );

      const sortedByMostRecent = freeDocuments.sort(
        (documentA, documentB) =>
          (documentB.decisionMetadata.date || 0) -
          (documentA.decisionMetadata.date || 0),
      );

      const mostRecentDocuments = sortedByMostRecent.slice(0, 50);

      const sortedByLeastRecent = freeDocuments.sort(
        (documentA, documentB) =>
          (documentA.decisionMetadata.date || 0) -
          (documentB.decisionMetadata.date || 0),
      );

      const leastRecentDocuments = sortedByLeastRecent.slice(0, 50);

      const combinedDocuments = mostRecentDocuments.concat(
        leastRecentDocuments,
      );

      if (combinedDocuments.length === 0) {
        return undefined;
      }

      return combinedDocuments[
        Math.floor(Math.random() * combinedDocuments.length)
      ];
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

    async updateNlpVersionsById(_id, nlpVersions) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                nlpVersions,
              }
            : document,
        ),
      );
      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },

    async updateLossById(_id, loss) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                loss,
              }
            : document,
        ),
      );
      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },

    async updateChecklistById(_id, checklist) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                checklist,
              }
            : document,
        ),
      );

      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },

    async updateAdditionalTermsParsingFailed(
      _id,
      additionalTermsParsingFailed,
    ) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                decisionMetadata: {
                  ...document.decisionMetadata,
                  additionalTermsParsingFailed,
                },
              }
            : document,
        ),
      );

      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },

    async updateCategoriesToOmitById(_id, categoriesToOmit) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                decisionMetadata: {
                  ...document.decisionMetadata,
                  categoriesToOmit,
                },
              }
            : document,
        ),
      );

      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },

    async updateComputedAdditionalTerms(_id, computedAdditionalTerms) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                decisionMetadata: {
                  ...document.decisionMetadata,
                  computedAdditionalTerms,
                },
              }
            : document,
        ),
      );

      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
    },

    async updateRouteById(_id, route) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                route,
              }
            : document,
        ),
      );
      const updatedDocument = collection.find((document) =>
        idModule.lib.equalId(_id, document._id),
      );

      return updatedDocument;
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
