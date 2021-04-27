import { uniq } from 'lodash';
import { documentType } from '@label/core';
import {
  buildProjection,
  buildRepositoryBuilder,
  projectedType,
} from '../../../repository';
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

    async findAllByPublicationCategoryAndStatus({
      publicationCategory,
      status,
    }) {
      return collection.find({ publicationCategory, status }).toArray();
    },

    async findAllByStatus(status) {
      return collection.find({ status: { $in: status } }).toArray();
    },

    async findAllByStatusProjection<projectionT extends keyof documentType>(
      status: documentType['status'][],
      projection: Array<projectionT>,
    ): Promise<Array<projectedType<documentType, projectionT>>> {
      return (collection
        .find({ status: { $in: status } })
        .project(buildProjection(projection))
        .toArray() as any) as Array<projectedType<documentType, projectionT>>;
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
  }),
});

function buildUpdateStatusQuery(status: documentType['status']) {
  return { status, updateDate: new Date().getTime() };
}
