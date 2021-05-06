import { uniq } from 'lodash';
import { documentType } from '@label/core';
import { buildProjection, buildRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildDocumentRepository };

const buildDocumentRepository = buildRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  collectionName: 'documents',
  indexes: [
    {
      status: 1,
    } as const,
    {
      publicationCategory: 1,
      status: 1,
    } as const,
    {
      priority: 1,
      status: 1,
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async countNotIn(idsNotToSearchIn) {
      const count = await collection.countDocuments({
        _id: { $nin: idsNotToSearchIn },
      });
      return count;
    },

    async findAllPublicationCategories() {
      const publicationCategories = await collection.distinct(
        'publicationCategory',
        {},
      );

      return uniq(publicationCategories);
    },

    async findAllSources() {
      return collection.distinct('source', {});
    },

    async findOneByStatusAndPriorityAmong(
      { status, priority },
      idsToSearchInFirst,
    ) {
      const document = await collection.findOne({
        priority,
        status,
        _id: { $in: idsToSearchInFirst },
      });
      return document || undefined;
    },

    async findOneByStatusAndPriorityNotIn(
      { status, priority },
      idsNotToSearchIn,
    ) {
      const document = await collection.findOne({
        priority,
        status,
        _id: { $nin: idsNotToSearchIn },
      });
      return document || undefined;
    },

    async findAllByPublicationCategoryLettersProjection(
      publicationCategoryLetters,
      projections,
    ) {
      return collection
        .find(
          buildFindByPublicationCategoryLettersRequest(
            publicationCategoryLetters,
          ),
        )
        .project(buildProjection(projections))
        .toArray();
    },

    async findAllByStatus(status) {
      return collection.find({ status: { $in: status } }).toArray();
    },

    async findAllByStatusProjection(status, projection) {
      return collection
        .find({ status: { $in: status } })
        .project(buildProjection(projection))
        .toArray();
    },

    async updateStatusById(id, status) {
      await collection.updateOne(
        { _id: id },
        { $set: buildUpdateStatusQuery(status) },
      );
    },

    async updateOneStatusByIdAndStatus(filter, update) {
      const result = await collection.updateOne(
        { _id: filter._id, status: filter.status },
        { $set: buildUpdateStatusQuery(update.status) },
      );
      return result.modifiedCount === 1;
    },

    async updateOneMarkedAsPublishedByIdAndStatus(filter, update) {
      const result = await collection.updateOne(
        { _id: filter._id, status: filter.status },
        { $set: buildUpdateMarkedAsPublishedQuery(update.markedAsPublished) },
      );
      return result.modifiedCount === 1;
    },
  }),
});

function buildUpdateStatusQuery(status: documentType['status']) {
  return { status, updateDate: new Date().getTime() };
}

function buildUpdateMarkedAsPublishedQuery(
  markedAsPublished: documentType['markedAsPublished'],
) {
  return { markedAsPublished, updateDate: new Date().getTime() };
}

function buildFindByPublicationCategoryLettersRequest(
  publicationCategoryLetters: string[],
) {
  return {
    $or: publicationCategoryLetters.map((publicationCategoryLetter) => ({
      publicationCategory: [publicationCategoryLetter],
    })),
  };
}
